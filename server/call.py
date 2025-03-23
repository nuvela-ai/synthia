import requests

# Define the API endpoint
url = "http://localhost:8000/UploadFragment"

# Define the payload
payload = {
    "paragraph": "This is a test paragraph for the fragment upload."
}

# Send the POST request
response = requests.post(url, json=payload)

# Print the response
print(response.status_code)
print(response.json())