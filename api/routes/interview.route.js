import express from 'express';
import { verifyToken } from '../middlewares/verifyUser.middleware.js';
import {
  saveInterviewSession,
  getInterviewHistory,
  getInterviewAnalytics,
} from '../controllers/interview.controller.js';

const router = express.Router();

router.post('/save', verifyToken, saveInterviewSession);
router.get('/history', verifyToken, getInterviewHistory);
router.get('/analytics', verifyToken, getInterviewAnalytics);

export default router;
