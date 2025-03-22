import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from some_embedding_library import embed_text  # Replace with actual embedding function
from flask import Flask, request, jsonify




class MCPServer:
    def __init__(self):
        self.knowledge_db = {}  # Dictionary with embeddings as keys and content as values

    def add_knowledge(self, new_text):  # this should be changed
        """Adds a new knowledge fragment based on user-provided additions."""
        embedding = embed_text(new_text)
        self.knowledge_db[tuple(embedding)] = new_text

    def find_similar_knowledge(self, prompt, top_k=5):
        """Finds the most similar knowledge fragments based on the prompt."""
        prompt_embedding = embed_text(prompt)
        embeddings = np.array(list(self.knowledge_db.keys()))
        similarities = cosine_similarity([prompt_embedding], embeddings)[0]
        top_indices = np.argsort(similarities)[-top_k:][::-1]
        return [(self.knowledge_db[tuple(embeddings[i])], similarities[i]) for i in top_indices]  # no need to return cosine_similarities

    def generate_content(self, prompt):
        """Generates content based on similar knowledge fragments."""
        similar_knowledge = self.find_similar_knowledge(prompt)
        generated_text = "\n".join([frag[0] for frag in similar_knowledge])
        return f"Generated Content:\n{generated_text}"

    def evaluate_paper_contribution(self, paper_text, selected_knowledge):
        """Determines the contribution of selected knowledge fragments."""
        paper_embedding = embed_text(paper_text)
        knowledge_embeddings = [embed_text(k) for k in selected_knowledge]
        contributions = cosine_similarity([paper_embedding], knowledge_embeddings)[0]
        return {selected_knowledge[i]: contributions[i] for i in range(len(selected_knowledge))}

mcp = MCPServer()
@app.route('/generate', methods=['POST'])
def generate():
    data = request.json
    prompt = data.get("prompt", "")
    generated_content = mcp.generate_content(prompt)
    return jsonify({"generated_content": generated_content})


@app.route('/evaluate', methods=['POST'])
def evaluate():
    data = request.json
    paper_text = data.get("paper_text", "")
    selected_knowledge = data.get("selected_knowledge", [])
    contribution_scores = mcp.evaluate_paper_contribution(paper_text, selected_knowledge)
    return jsonify({"contribution_scores": contribution_scores})

@app.route('/add_knowledge', methods=['POST'])
def add_knowledge():
    data = request.json
    new_text = data.get("new_text", "")
    if new_text:
        mcp.add_knowledge(new_text)
        return jsonify({"message": "Knowledge added successfully."})
    return jsonify({"error": "No text provided."}), 400
  

if __name__ == "__main__":
    app.run(debug=True)






    # server.add_knowledge("Knowledge fragment 1") # TODO
    # server.add_knowledge("Knowledge fragment 2")  #TODO
    # server.add_knowledge("Knowledge fragment 3")  #TODO
    # prompt = "Prompt for content generation"    # TODO
    # print(server.generate_content(prompt))
    # paper_text = "Paper text with selected knowledge fragments"  # how and when to get this?
    # selected_knowledge = ["Knowledge fragment 1", "Knowledge fragment 3"]  # how to determine this?
    # print(server.evaluate_paper_contribution(paper_text, selected_knowledge))
