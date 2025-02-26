    import { setupDriver } from '../config/seleniumConfig.js';
    import axios from 'axios';


    const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"
    export const scrapeRepository = async (repo_url) => {
        const driver = await setupDriver();

        try {
            const gitingest_url = repo_url.replace('github.com', 'gitingest.com');
            await driver.get(gitingest_url);
            await new Promise(resolve => setTimeout(resolve, 10000)); // Wait for elements to load

            const dir_structure = await driver.findElement({ id: 'directory-structure-container' }).getText();
            const code_content = await driver.findElement({ className: 'result-text' }).getText();

            return { dir_structure, code_content };
        } finally {
            await driver.quit();
        }
    };


    export const analyzeFileContent = async (dir_structure, code_content, file_name) => {
        const prompt = `
            Here is the directory structure and extracted code content from a GitHub repository:
            \n\nDirectory Structure:\n${dir_structure}
            \n\nCode Content:\n${code_content}
            \n\nNow, analyze the file "${file_name}" in detail.
            Explain its functionality, key logic, dependencies, and its interaction with other files in the project.
        `;

        const payload = {
            model: 'meta-llama/llama-3.3-70b-instruct:free',
            messages: [
                { role: 'system', content: 'You are an AI specializing in code analysis.' },
                { role: 'user', content: prompt }
            ]
        };
        const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
        const headers = {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json'
        };

        try {
            const response = await axios.post(OPENROUTER_API_URL, payload, { headers });
            return response.data;
        } catch (error) {
            console.error("🚨 OpenRouter AI Error:", error.response?.data || error.message);
            throw new Error("Failed to analyze file content with OpenRouter AI.");
        }
    };

    export const analyzeRepoContent = async(dir_structure, code_content) => {
        const prompt = `Analyze the following GitHub repository and provide insights on what the code is doing overall, code structure, tech stacks used, and explain function performed by all the files in short.\n\nDirectory Structure:\n${dir_structure}\n\nCode Content:\n${code_content}`
        
        const payload = {
            model: 'meta-llama/llama-3.3-70b-instruct:free',
            messages: [
                { role: 'system', content: 'You are an AI specialized in analyzing GitHub repositories.' },
                { role: 'user', content: prompt }
            ]
        };

        const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
        const headers = {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json'
        };

        try {
            const response = await axios.post(OPENROUTER_API_URL, payload, { headers });
            return response.data;
        } catch (error) {
            console.error("🚨 OpenRouter AI Error:", error.response?.data || error.message);
            throw new Error("Failed to analyze the given Repository");
        }
    }
