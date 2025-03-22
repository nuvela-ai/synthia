from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any 
from testmain import SynthiaMcpServer  # Import the refactored class
import asyncio

app = FastAPI()

# Define request models
class ProjectInitRequest(BaseModel):
    project_name: str
    description: Optional[str] = ""
    template: Optional[str] = "default"

class SuggestFragmentRequest(BaseModel):
    project_id: str
    context: str
    fragment_type: Optional[str] = "mixed"

class SaveFragmentRequest(BaseModel):
    project_id: str
    fragment: str
    fragment_type: Optional[str] = "mixed"
    metadata: Optional[Dict[str, Any]] = {}

class GenerateCitationsRequest(BaseModel):
    project_id: str
    format: Optional[str] = "apa"

# Initialize the SynthiaMcpServer
server = SynthiaMcpServer(mock=True)

# Define API endpoints
@app.post("/project-init")
async def project_init(request: ProjectInitRequest):
    response = await server._handle_project_init(request.dict())
    return response

@app.post("/suggest-fragment")
async def suggest_fragment(request: SuggestFragmentRequest):
    response = await server._handle_suggest_fragment(request.dict())
    return response

@app.post("/save-fragment")
async def save_fragment(request: SaveFragmentRequest):
    response = await server._handle_save_fragment(request.dict())
    return response

@app.post("/generate-citations")
async def generate_citations(request: GenerateCitationsRequest):
    response = await server._handle_generate_citations(request.dict())
    return response

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)