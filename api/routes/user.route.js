import express from 'express';
import { deleteUser, updateUser, getUserListings } from '../controllers/user.controller.js';
import { verifyToken } from '../middlewares/verifyUser.middleware.js';

const router = express.Router();

router.post('/update/:id', verifyToken, updateUser);
router.delete('/delete/:id', verifyToken, deleteUser);
router.get('/listings/:id', verifyToken, getUserListings);

export default router;
