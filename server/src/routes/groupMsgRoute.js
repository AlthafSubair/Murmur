import express from 'express';
import { addMember, createGrp, deleteMember, fetchGrp, fetchGrpById, getMsges, sendGrpMsg } from '../controllers/grpmsgController.js';
import upload from '../middleware/multer.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

router.post('/create/:id', upload.single('picture'), verifyToken, createGrp)
router.get('/:id', verifyToken, fetchGrp)
router.get('/grp/:id', verifyToken, fetchGrpById);
router.delete('/member/:id', verifyToken, deleteMember)
router.patch('/member/:id', verifyToken, addMember)
router.get('/message/:id', verifyToken, getMsges)
router.post('/message/:id', verifyToken, upload.single('image'), sendGrpMsg)

export default router;