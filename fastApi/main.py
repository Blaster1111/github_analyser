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
from selenium.common.exceptions import TimeoutException, NoSuchElementException

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
    
    # Add user agent to avoid detection as a bot
    options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36")
    
    try:
        # Use ChromeDriverManager to download the appropriate ChromeDriver version
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=options)
        driver.set_page_load_timeout(90)  # Increase page load timeout
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
    
    driver = None
    try:
        driver = setup_driver()
        logger.info("Chrome driver initialized successfully")
        
        gitingest_url = request.repo_url.replace("github.com", "gitingest.com")
        logger.info(f"Navigating to: {gitingest_url}")
        
        driver.get(gitingest_url)
        logger.info("Page loaded")
        
        # Wait longer and check for different possible elements
        wait = WebDriverWait(driver, 90)
        
        # First check if there's an error message
        try:
            error_element = wait.until(
                EC.presence_of_element_located((By.CLASS_NAME, "error-message"))
            )
            error_text = error_element.text
            logger.warning(f"Error message found on page: {error_text}")
            return {"error": error_text}
        except TimeoutException:
            # No error message found, continue with normal scraping
            pass
        
        # Try to find directory structure with multiple possible selectors
        dir_structure = None
        possible_dir_selectors = [
            (By.ID, "directory-structure-container"),
            (By.CLASS_NAME, "directory-structure"),
            (By.CSS_SELECTOR, ".file-explorer"),
            (By.XPATH, "//div[contains(@class, 'file') or contains(@class, 'directory')]")
        ]
        
        for selector_type, selector in possible_dir_selectors:
            try:
                logger.info(f"Trying to find directory structure with selector: {selector}")
                dir_structure_element = wait.until(
                    EC.presence_of_element_located((selector_type, selector))
                )
                dir_structure = dir_structure_element.text
                logger.info(f"Directory structure found with selector: {selector}")
                break
            except TimeoutException:
                logger.warning(f"Directory structure not found with selector: {selector}")
                continue
        
        # Try to find code content with multiple possible selectors
        code_content = None
        possible_code_selectors = [
            (By.CLASS_NAME, "result-text"),
            (By.CSS_SELECTOR, ".code-content"),
            (By.TAG_NAME, "pre"),
            (By.XPATH, "//div[contains(@class, 'code') or contains(@class, 'result')]")
        ]
        
        for selector_type, selector in possible_code_selectors:
            try:
                logger.info(f"Trying to find code content with selector: {selector}")
                code_content_element = wait.until(
                    EC.presence_of_element_located((selector_type, selector))
                )
                code_content = code_content_element.text
                logger.info(f"Code content found with selector: {selector}")
                break
            except TimeoutException:
                logger.warning(f"Code content not found with selector: {selector}")
                continue
        
        # Take screenshot for debugging if elements weren't found
        if not dir_structure or not code_content:
            screenshot_path = "/tmp/debug_screenshot.png"
            driver.save_screenshot(screenshot_path)
            logger.info(f"Saved screenshot to {screenshot_path} for debugging")
            
            # Get page source for debugging
            page_source = driver.page_source
            logger.info(f"Page title: {driver.title}")
            logger.info(f"Current URL: {driver.current_url}")
            
            # Return what we have, even if incomplete
            result = {}
            if dir_structure:
                result["directory_structure"] = dir_structure
            if code_content:
                result["code_content"] = code_content
                
            if not result:
                result["error"] = "Could not find directory structure or code content"
                result["page_title"] = driver.title
                result["current_url"] = driver.current_url
            
            return result
        
        return {
            "directory_structure": dir_structure,
            "code_content": code_content
        }
    except Exception as e:
        logger.error(f"Error during scraping: {str(e)}", exc_info=True)
        if driver:
            # Take screenshot on error
            driver.save_screenshot("/tmp/error_screenshot.png")
            logger.info("Saved error screenshot to /tmp/error_screenshot.png")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if driver:
            logger.info("Closing driver")
            driver.quit()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000)