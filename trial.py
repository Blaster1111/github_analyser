from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from playwright.sync_api import sync_playwright
import logging
import time

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

class RepoRequest(BaseModel):
    repo_url: str

@app.get("/")
def read_root():
    return {"message": "Service is running. Use POST /scrape endpoint with repo_url parameter."}

@app.post("/scrape")
def scrape_gitingest(request: RepoRequest):
    logger.info(f"Received request to scrape: {request.repo_url}")
    
    if not request.repo_url or "github.com" not in request.repo_url:
        raise HTTPException(status_code=400, detail="Invalid GitHub repository URL")
    
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True, args=["--no-sandbox", "--disable-gpu"])
            page = browser.new_page()
            gitingest_url = request.repo_url.replace("github.com", "gitingest.com")
            logger.info(f"Navigating to: {gitingest_url}")
            
            page.goto(gitingest_url)
            logger.info("Page loaded")
            
            page_source = page.content()
            logger.info(f"Full page data scraped: {page_source}")
            
            logger.info("Waiting 15 seconds before scraping elements...")
            time.sleep(15)
            
            logger.info("Waiting for directory structure...")
            dir_structure = page.wait_for_selector("#directory-structure-container", timeout=30000).text_content()
            logger.info(f"Directory structure found: {dir_structure}")
            
            logger.info("Waiting for code content...")
            code_content = page.wait_for_selector(".result-text", timeout=30000).text_content()
            logger.info(f"Code content found: {code_content}")
            
            browser.close()
            
            return {
                "directory_structure": dir_structure,
                "code_content": code_content
            }
    except Exception as e:
        logger.error(f"Scraping failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Scraping error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000)