import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import requests
import json
from dotenv import load_dotenv
import os
import cohere
from pinecone import (
    Pinecone
)
from mcp.server.fastmcp import FastMCP
import uuid
from sklearn.metrics.pairwise import cosine_similarity
import json

load_dotenv()

COHERE_API_KEY = os.getenv('COHERE_API_KEY')
PINECONE_API_KEY = os.getenv('PINECONE_API_KEY')

pc = Pinecone(api_key=PINECONE_API_KEY)
co = cohere.Client(COHERE_API_KEY)
namespace="mcp-namespace"
idx = pc.Index(namespace)

mcp = FastMCP("Synthia")


def PineconeUpsert(id, vector, data): # ("Id", Embedding, {"text": paragraph})
    content = json.loads(data)['text']
    idx.upsert(
        vectors=[
            (id, vector, {"metadata": str(content)})
        ],
        namespace=namespace
    )
    return (id, vector, {"metadata": str(data)})

def PineconeQuery(vector, top_k=5):
    return idx.query(
        vector=vector,
        top_k=top_k,
        namespace=namespace,
        include_values=False,
        include_metadata=True
    )

def EmbedParagraph(text):
    try:
        response = co.embed(
            texts=[text],  # Pass the text as a list
            model="embed-english-v3.0",  # Use the English embedding model
            input_type="search_query"  # Optional: Specify the input type
        )

        # Extract the embeddings from the response
        embeddings = response.embeddings[0]  # Get the first (and only) embedding
        return embeddings

    except Exception as e:
        return []

@mcp.tool()
def UploadFragment(paragraph):
    embedding = EmbedParagraph(paragraph)
    id = str(uuid.uuid5(uuid.NAMESPACE_DNS, paragraph))
    return PineconeUpsert(id, embedding, {"text": paragraph})
    
@mcp.tool()
def QueryFragment(prompt):
    embedding = EmbedParagraph(prompt)
    return PineconeQuery(embedding)
  
@mcp.tool()
def CalculateContribution(paper, fragmentList): # fragmentList is a list of ids [i1, i2, i3, ...]
    """Determines the contribution of selected knowledge fragments."""
    vectors = []
    for fragment_id in fragmentList:
        vector = idx.query(
            id=fragment_id,
            top_k=1,
            namespace=namespace,
            include_values=True,
            include_metadata=True
        )['matches'][0]['values']
        vectors.append(vector)
    paper_embedding = EmbedParagraph(paper)
    contributions = cosine_similarity([paper_embedding], vectors)[0]
    return {fragmentList[i]: contributions[i] for i in range(len(fragmentList))}


if __name__ == "__main__":
    mcp.run(transport='stdio')
