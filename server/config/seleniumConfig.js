import { Builder } from 'selenium-webdriver';
import chrome from "selenium-webdriver/chrome.js";

export const setupDriver = async () => {
    const options = new chrome.Options();
    
    options.addArguments(
        '--headless',
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--window-size=1920,1080', 
        '--start-maximized',       
        '--disable-extensions',    
        '--disable-infobars'        
    );
    options.addArguments('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.6943.141 Safari/537.36');
    
    return new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();
};