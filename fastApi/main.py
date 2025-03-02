from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import time
import logging
import os

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

class RepoRequest(BaseModel):
    repo_url: str

def setup_driver():
    options = Options()
    
    # Essential options for running Chrome in Docker
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    
    # Additional stability options
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1920,1080")
    options.add_argument("--disable-extensions")
    options.add_argument("--disable-setuid-sandbox")
    options.add_argument("--disable-web-security")
    
    # Logging
    options.add_argument("--verbose")
    options.add_argument("--log-level=3")
    
    try:
        # Use ChromeDriverManager to download the appropriate ChromeDriver version
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=options)
        return driver
    except Exception as e:
        logger.error(f"Failed to create Chrome driver: {str(e)}")
        raise

@app.get("/")
def read_root():
    return {"message": "Service is running. Use POST /scrape endpoint with repo_url parameter."}

@app.post("/scrape")
def scrape_gitingest(request: RepoRequest):
    logger.info(f"Received request to scrape: {request.repo_url}")
    
    if not request.repo_url or "github.com" not in request.repo_url:
        raise HTTPException(status_code=400, detail="Invalid GitHub repository URL")
    
    try:
        driver = setup_driver()
        logger.info("Chrome driver initialized successfully")
        
        try:
            gitingest_url = request.repo_url.replace("github.com", "gitingest.com")
            logger.info(f"Navigating to: {gitingest_url}")
            
            # Set page load timeout
            driver.set_page_load_timeout(60)
            driver.get(gitingest_url)
            logger.info("Page loaded")
            
            # Use a longer wait time for initial page load
            wait = WebDriverWait(driver, 60)
            
            # Extract directory structure with wait
            logger.info("Waiting for directory structure to load...")
            dir_structure = wait.until(
                EC.presence_of_element_located((By.ID, "directory-structure-container"))
            ).text
            logger.info("Directory structure found")
            
            # Extract code content with wait
            logger.info("Waiting for code content to load...")
            code_content = wait.until(
                EC.presence_of_element_located((By.CLASS_NAME, "result-text"))
            ).text
            logger.info("Code content found")
            
            return {
                "directory_structure": dir_structure,
                "code_content": code_content
            }
        except Exception as e:
            logger.error(f"Error during scraping: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))
        finally:
            logger.info("Closing driver")
            driver.quit()
    except Exception as e:
        logger.error(f"Error setting up driver: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000)