import { Router } from 'express';
import { SubjectController } from '../controller/subjectController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// All subject routes require auth
router.get('/subjects', authMiddleware, SubjectController.list);
router.post('/subjects', authMiddleware, SubjectController.create);
router.put('/subjects/:id', authMiddleware, SubjectController.update);
router.delete('/subjects/:id', authMiddleware, SubjectController.remove);

export default router;
