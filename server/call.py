import requests

# Base URL for your FastAPI server
base_url = "http://localhost:8000"

# 1. Upload a fragment
def upload_fragment(paragraph):
    url = f"{base_url}/UploadFragment"
    payload = {"paragraph": paragraph}
    response = requests.post(url, json=payload)
    print(f"Upload Fragment Status: {response.status_code}")
    print(f"Response: {response.json()}")
    return response.json()

# 2. Query fragments
def query_fragment(prompt):
    url = f"{base_url}/QueryFragment"
    payload = {"prompt": prompt}
    response = requests.post(url, json=payload)
    print(f"Query Fragment Status: {response.status_code}")
    print(f"Response: {response.json()}")
    return response.json()

# 3. Calculate contribution
def calculate_contribution(paper, fragment_list):
    url = f"{base_url}/CalculateContribution"
    payload = {
        "paper": paper,
        "fragmentList": fragment_list
    }
    response = requests.post(url, json=payload)
    print(f"Calculate Contribution Status: {response.status_code}")
    print(f"Response: {response.json()}")
    return response.json()

# Example usage
if __name__ == "__main__":
    # Upload a fragment
    paragraph = "This is a test paragraph for the fragment upload."
    upload_result = upload_fragment(paragraph)
    
    # Get the ID from the upload result
    fragment_id = upload_result.get("id")
    
    # Upload a few more fragments for testing
    upload_fragment("Another test paragraph with similar concepts.")
    upload_fragment("A third paragraph about testing and fragments.")
    
    # Query similar fragments
    prompt = "Test paragraph"
    query_result = query_fragment(prompt)
    
    # Get fragment IDs from query result based on Pinecone response structure
    fragment_ids = []
    if "matches" in query_result:
        fragment_ids = [match["id"] for match in query_result["matches"]]
    
    print(f"Found fragment IDs: {fragment_ids}")
    
    if fragment_ids:
        # Calculate contribution if we have fragment IDs
        paper = "This is a test paper that needs to be analyzed for fragment contributions."
        contribution_result = calculate_contribution(paper, fragment_ids)
    else:
        print("No matching fragments found to calculate contribution.")