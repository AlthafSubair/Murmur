import express from "express";
import verifyToken from '../middleware/verifyToken.js'
import { getMessage, getUsers, sendMessage } from "../controllers/messageController.js";

const router = express.Router();

router.get('/users', verifyToken, getUsers)
router.get('/:id', verifyToken, getMessage)
router.post('/:id', verifyToken, sendMessage)

export default router;