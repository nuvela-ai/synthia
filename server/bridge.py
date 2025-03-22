from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import server as MCP  # Import your existing server module

app = Flask(__name__)
CORS(app)

@app.route('/upsert', methods=['POST'])
def upsert():
    data = request.json
    vector = data.get('vector')
    metadata = data.get('metadata')
    
    if vector is None or metadata is None:
        return jsonify({"error": "vector and metadata are required"}), 400
    
    MCP.PineconeUpsert(vector, metadata)
    return jsonify({"status": "success"}), 200

@app.route('/query', methods=['POST'])
def query():
    data = request.json
    vector = data.get('vector')
    top_k = data.get('top_k', 5)
    
    if vector is None:
        return jsonify({"error": "vector is required"}), 400
    
    result = MCP.PineconeQuery(vector, top_k)
    return jsonify(result), 200

@app.route('/upload_fragment', methods=['POST'])
def upload_fragment():
    data = request.json
    paragraph = data.get('paragraph')
    
    if paragraph is None:
        return jsonify({"error": "paragraph is required"}), 400
    
    MCP.UploadFragment(paragraph)
    return jsonify({"status": "success"}), 200

@app.route('/query_fragment', methods=['POST'])
def query_fragment():
    data = request.json
    paragraph = data.get('paragraph')
    
    if paragraph is None:
        return jsonify({"error": "paragraph is required"}), 400
    
    result = MCP.QueryFragment(paragraph)
    return jsonify(result), 200

@app.route('/calculate_contribution', methods=['POST'])
def calculate_contribution():
    data = request.json
    paper = data.get('paper')
    fragment_list = data.get('fragment_list')
    
    if paper is None or fragment_list is None:
        return jsonify({"error": "paper and fragment_list are required"}), 400
    
    result = MCP.CalculateContribution(paper, fragment_list)
    return jsonify(result), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)