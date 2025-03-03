import { analyzeRepoContent, scrapeRepository, analyzeFileContent, generateAlgo, generateReadme } from '../services/analysisService.js';
import { ApiResponse } from '../utils/responseHandler.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const scrapeRepo = asyncHandler(async (req, res) => {
    const { repo_url } = req.body;
    const analysis = await scrapeRepository(repo_url);
    res.status(200).json(new ApiResponse(200, analysis, 'Repository analysis completed.'));
});

export const analyzeFile = asyncHandler(async (req, res) => {
    const { repo_url, file_name } = req.body;

    const { dir_structure, code_content } = await scrapeRepository(repo_url);
    
    const fileAnalysis = await analyzeFileContent(dir_structure, code_content, file_name);

    res.status(200).json(new ApiResponse(200, fileAnalysis, `Detailed analysis of ${file_name}.`));
})

export const analyzeRepo = asyncHandler(async(req,res)=> {
    const {repo_url} = req.body;
    
    const {dir_structure, code_content} = await scrapeRepository(repo_url);
    console.log(`here it is${dir_structure}`);
    const repoAnalysis = await analyzeRepoContent(dir_structure, code_content);

    res.status(200).json(new ApiResponse(200, repoAnalysis, `Analysis of ${repo_url}`));
});

export const generateTypingTest = asyncHandler(async(req,res)=>{
    const {language} = req.body;

    const typingTest = await generateAlgo(language);
    // if(!typingTest){
    //     throw new ApiError();
    // }
    res.status(200).json(new ApiResponse(200,typingTest,`Typing Test in ${language}`));
});

export const generateRepoReadme = asyncHandler(async (req, res) => {
    const { repo_url } = req.body;
    const { dir_structure, code_content } = await scrapeRepository(repo_url);
    const readmeContent = await generateReadme(dir_structure, code_content);
    
    res.status(200).json(new ApiResponse(
        200, 
        readmeContent, 
        `README generated for ${repo_url}`
    ));
});
