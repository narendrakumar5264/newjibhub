import express from 'express';
import { verifyToken } from '../middlewares/verifyUser.middleware.js';
import {
  applyToJob,
  checkApplicationStatus,
  getMyApplications,
  getRecruiterApplications,
  updateApplicationStatus,
} from '../controllers/application.controller.js';

const router = express.Router();

router.post('/apply', verifyToken, applyToJob);
router.get('/check/:listingId', verifyToken, checkApplicationStatus);
router.get('/my-applications', verifyToken, getMyApplications);
router.get('/recruiter', verifyToken, getRecruiterApplications);
router.patch('/status/:applicationId', verifyToken, updateApplicationStatus);

export default router;
