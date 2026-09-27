import express from 'express';
import {
  signin,
  signOut,
  signup,
  getMe,
  forgotPassword,
  resetPassword,
} from '../controllers/auth.controller.js';

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/me", getMe);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get('/signout', signOut);

export default router;