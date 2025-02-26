import express from 'express';
import { analyzeRepo, analyzeFile, scrapeRepo } from '../controllers/analysisController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

router.post('/scrape-repo', scrapeRepo);
router.post('/analyze-file', analyzeFile);
router.post('/analyze-repo', analyzeRepo);

export default router;
