import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { authMiddleware } from '../middleware/authMiddleware';
import { PriorityLevel } from '../entity/PriorityLevel';

const router = Router();

// Lookup only (no CRUD)
router.get('/priority-levels', authMiddleware, async (_req, res) => {
  try {
    const repo = AppDataSource.getRepository(PriorityLevel);
    const levels = await repo.find({ order: { sortOrder: 'ASC' } });
    return res.json(levels);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
