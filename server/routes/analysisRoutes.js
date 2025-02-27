import express from 'express';
import { analyzeRepo, analyzeFile, scrapeRepo, generateTypingTest, generateRepoReadme } from '../controllers/analysisController.js';

const router = express.Router();

router.post('/scrape-repo', scrapeRepo);
router.post('/analyze-file', analyzeFile);
router.post('/analyze-repo', analyzeRepo);
router.post('/generate/tt',generateTypingTest);
router.post('/generate-readme', generateRepoReadme);

export default router;
