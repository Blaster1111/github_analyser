from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

app = FastAPI()

class RepoRequest(BaseModel):
    repo_url: str

def setup_driver():
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-gpu")
    # In Docker, we don't use WebDriverManager
    options.binary_location = "/usr/bin/google-chrome"
    driver = webdriver.Chrome(options=options)
    return driver

@app.post("/scrape")
def scrape_gitingest(request: RepoRequest):
    driver = setup_driver()
    try:
        gitingest_url = request.repo_url.replace("github.com", "gitingest.com")
        driver.get(gitingest_url)
        
        # Use WebDriverWait instead of sleep
        wait = WebDriverWait(driver, 30)
        
        # Extract directory structure with wait
        dir_structure = wait.until(
            EC.presence_of_element_located((By.ID, "directory-structure-container"))
        ).text
        
        # Extract code content with wait
        code_content = wait.until(
            EC.presence_of_element_located((By.CLASS_NAME, "result-text"))
        ).text
        
        return {
            "directory_structure": dir_structure,
            "code_content": code_content
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        driver.quit()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)