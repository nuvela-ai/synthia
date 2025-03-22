import os
from dotenv import load_dotenv
# Load environment variables from .env file
import cohere

load_dotenv()

# Access the API key from the environment variable
API_KEY = os.getenv('COHERE')

if not API_KEY:
    raise ValueError("Please set the COHERE_API_KEY environment variable.")

# Initialize the Cohere client
co = cohere.Client(API_KEY)

# Define the input text
input_text = "Your text string goes here."

# Generate embeddings
try:
    response = co.embed(
        texts=[input_text],  # Pass the text as a list
        model="embed-english-v3.0",  # Use the English embedding model
        input_type="search_query"  # Optional: Specify the input type
    )

    # Extract the embeddings from the response
    embeddings = response.embeddings[0]  # Get the first (and only) embedding
    print("Embeddings:", type(embeddings))
    print("Embeddings:", len(embeddings))

except Exception as e:
    print("Failed to retrieve embeddings:", str(e))