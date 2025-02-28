from fastapi import FastAPI, HTTPException, Request
import gitingest
import uvicorn
import asyncio
import re
import json

app = FastAPI()

def extract_structure_and_content(response_text):
    """
    Extracts directory structure and raw code content from gitingest response.
    Returns directory structure as is and doesn't parse individual files.
    """
    # Split by the first occurrence of "================================================"
    parts = response_text.split("================================================", 1)
    
    # First part is typically the directory structure
    directory_structure = parts[0].strip() if parts else ""
    
    # The rest is the raw code content including all file separators
    code_content = "================================================" + parts[1] if len(parts) > 1 else ""
    
    return directory_structure, code_content

async def fetch_repo_data(repo_url: str):
    return await asyncio.to_thread(gitingest.ingest, repo_url)

@app.post("/fetch-repo")
async def fetch_repo(request: Request):
    try:
        # Parse JSON request manually
        body = await request.json()
        
        # Check if repo_url is in the request
        if 'repo_url' not in body:
            raise HTTPException(status_code=400, detail="Missing repo_url field")
        
        repo_url = body['repo_url']
        
        # Fetch repository data
        repo_data = await fetch_repo_data(repo_url)
        
        # The gitingest response might be a string or a dictionary
        if isinstance(repo_data, str):
            directory_structure, code_content = extract_structure_and_content(repo_data)
        else:
            # If it's a dictionary, we need to convert it to a string first
            repo_str = str(repo_data)
            directory_structure, code_content = extract_structure_and_content(repo_str)
        
        return {
            "directory_structure": directory_structure,
            "code_content": code_content
        }
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)