from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

class RepoRequest(BaseModel):
    repo_url: str

def setup_driver():
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1920,1080")
    
    try:
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=options)
        logger.info("Chrome driver setup complete")
        return driver
    except Exception as e:
        logger.error(f"Failed to initialize Chrome driver: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Driver setup failed: {str(e)}")

@app.get("/")
def read_root():
    return {"message": "Service is running. Use POST /scrape endpoint with repo_url parameter."}

@app.post("/scrape")
def scrape_gitingest(request: RepoRequest):
    logger.info(f"Received request to scrape: {request.repo_url}")
    
    if not request.repo_url or "github.com" not in request.repo_url:
        raise HTTPException(status_code=400, detail="Invalid GitHub repository URL")
    
    driver = None
    try:
        driver = setup_driver()
        gitingest_url = request.repo_url.replace("github.com", "gitingest.com")
        logger.info(f"Navigating to: {gitingest_url}")
        
        driver.get(gitingest_url)
        logger.info("Page loaded")
        
        wait = WebDriverWait(driver, 60)
        logger.info("Waiting for directory structure...")
        dir_structure = wait.until(
            EC.presence_of_element_located((By.ID, "directory-structure-container"))
        ).text
        
        logger.info("Waiting for code content...")
        code_content = wait.until(
            EC.presence_of_element_located((By.CLASS_NAME, "result-text"))
        ).text
        
        return {
            "directory_structure": dir_structure,
            "code_content": code_content
        }
    except Exception as e:
        logger.error(f"Scraping failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Scraping error: {str(e)}")
    finally:
        if driver:
            logger.info("Closing driver")
            driver.quit()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)