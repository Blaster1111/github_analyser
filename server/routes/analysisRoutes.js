import express from 'express';
import { analyzeRepo, analyzeFile, scrapeRepo, generateTypingTest } from '../controllers/analysisController.js';

const router = express.Router();

router.post('/scrape-repo', scrapeRepo);
router.post('/analyze-file', analyzeFile);
router.post('/analyze-repo', analyzeRepo);
router.post('/generate/tt',generateTypingTest);

export default router;
