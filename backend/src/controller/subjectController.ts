import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Subject } from '../entity/Subject';
import { User } from '../entity/User';
import { AuthRequest } from '../middleware/authMiddleware';

export class SubjectController {
  static async list(req: Request, res: Response) {
    const authReq = req as AuthRequest;

    try {
      const subjectRepo = AppDataSource.getRepository(Subject);
      const subjects = await subjectRepo.find({
        where: { user: { id: authReq.userId } },
        order: { createdAt: 'DESC' },
      });
      return res.json(subjects);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  static async create(req: Request, res: Response) {
    const authReq = req as AuthRequest;
    const { name, color, description } = req.body as {
      name?: string;
      color?: string;
      description?: string;
    };

    if (!name || name.trim().length < 2) {
      return res.status(400).json({ message: 'Subject name must be at least 2 characters' });
    }

    try {
      const userRepo = AppDataSource.getRepository(User);
      const subjectRepo = AppDataSource.getRepository(Subject);

      const user = await userRepo.findOne({ where: { id: authReq.userId } });
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      const subject = subjectRepo.create({
        name: name.trim(),
        color: color || '#0d6efd', // default Bootstrap blue
        description: description || '',
        user,
      });

      await subjectRepo.save(subject);
      return res.status(201).json(subject);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  static async update(req: Request, res: Response) {
    const authReq = req as AuthRequest;
    const id = Number(req.params.id);
    const { name, color, description } = req.body as {
      name?: string;
      color?: string;
      description?: string;
    };

    if (!id || Number.isNaN(id)) {
      return res.status(400).json({ message: 'Invalid subject id' });
    }

    try {
      const subjectRepo = AppDataSource.getRepository(Subject);
      const subject = await subjectRepo.findOne({
        where: { id, user: { id: authReq.userId } },
      });

      if (!subject) {
        return res.status(404).json({ message: 'Subject not found' });
      }

      if (name && name.trim().length >= 2) {
        subject.name = name.trim();
      }
      if (color) {
        subject.color = color;
      }
      if (description !== undefined) {
        subject.description = description;
      }

      await subjectRepo.save(subject);
      return res.json(subject);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  static async remove(req: Request, res: Response) {
    const authReq = req as AuthRequest;
    const id = Number(req.params.id);

    if (!id || Number.isNaN(id)) {
      return res.status(400).json({ message: 'Invalid subject id' });
    }

    try {
      const subjectRepo = AppDataSource.getRepository(Subject);
      const subject = await subjectRepo.findOne({
        where: { id, user: { id: authReq.userId } },
      });

      if (!subject) {
        return res.status(404).json({ message: 'Subject not found' });
      }

      await subjectRepo.remove(subject);
      // 204 = No Content (delete succeeded, no body)
      return res.status(204).send();
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  }
}
