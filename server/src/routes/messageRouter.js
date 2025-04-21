import express from "express";
import verifyToken from '../middleware/verifyToken.js'
import { getMessage, getUsers, sendMessage } from "../controllers/messageController.js";
import upload from '../middleware/multer.js';

const router = express.Router();

router.get('/users', verifyToken, getUsers)
router.get('/:id', verifyToken, getMessage)
router.post('/:id', verifyToken, upload.single('image'), sendMessage)

export default router;