import { Builder } from 'selenium-webdriver';
import chrome from "selenium-webdriver/chrome.js";


export const setupDriver = async () => {
    const options = new chrome.Options();
    options.addArguments('--headless', '--no-sandbox', '--disable-dev-shm-usage');

    return new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();
};