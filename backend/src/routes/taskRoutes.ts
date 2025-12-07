import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { TaskController } from '../controller/taskController';

const router = Router();

router.get('/tasks', authMiddleware, TaskController.list);
router.post('/tasks', authMiddleware, TaskController.create);
router.put('/tasks/:id', authMiddleware, TaskController.update);
router.delete('/tasks/:id', authMiddleware, TaskController.remove);

export default router;
