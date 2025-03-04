import axios from 'axios';

const API_BASE_URL = 'https://gitlyser.onrender.com/api';

export const analyzeRepo = async (repo_url: string) => {
    return axios.post(`${API_BASE_URL}/analyze-repo`, { repo_url }, {timeout:10000});
};

export const analyzeFile = async (repo_url: string, file_name: string) => {
    return axios.post(`${API_BASE_URL}/analyze-file`, { repo_url, file_name });
};

export const scrapeRepo = async(repo_url: string)=>{
    return axios.post(`${API_BASE_URL}/scrape-repo`, {repo_url});
}

export const generateReadme = async (repo_url: string) => {
    return axios.post(`${API_BASE_URL}/generate-readme`, { repo_url });
};