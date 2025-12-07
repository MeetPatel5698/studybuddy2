import { Router } from 'express';
import { AuthController } from '../controller/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/profile', authMiddleware, AuthController.profile);

export default router;
