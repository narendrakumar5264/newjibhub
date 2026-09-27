import express from 'express';
import { verifyToken } from '../middlewares/verifyUser.middleware.js';
import {
  saveResumeAnalysis,
  getResumeHistory,
  toggleRoadmapStep,
  getLatestResume,
} from '../controllers/resume.controller.js';

const router = express.Router();

router.post('/save', verifyToken, saveResumeAnalysis);
router.get('/history', verifyToken, getResumeHistory);
router.get('/latest', verifyToken, getLatestResume);
router.patch('/roadmap/:resumeId/:stepIndex', verifyToken, toggleRoadmapStep);

export default router;
