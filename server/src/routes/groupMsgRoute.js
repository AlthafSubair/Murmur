import express from 'express';
import { createGrp } from '../controllers/grpmsgController.js';
import upload from '../middleware/multer.js';

const router = express.Router();

router.post('/create/:id', upload.single('picture'), createGrp)

export default router;