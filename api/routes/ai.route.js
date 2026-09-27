import express from 'express';
import {
  getInterviewQuestion,
  analyzeInterviewAnswer,
  analyzeResume,
  calculateMatchScore,
  expandDescription,
} from '../controllers/ai.controller.js';

const router = express.Router();

router.post('/interview/question', getInterviewQuestion);
router.post('/interview/analyze', analyzeInterviewAnswer);
router.post('/resume/analyze', analyzeResume);
router.post('/match-score', calculateMatchScore);
router.post('/listing/expand', expandDescription);

export default router;
