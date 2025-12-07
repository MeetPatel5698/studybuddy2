import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Task } from '../entity/Task';
import { Subject } from '../entity/Subject';
import { PriorityLevel } from '../entity/PriorityLevel';
import { AuthRequest } from '../middleware/authMiddleware';

export class TaskController {
  // GET /api/tasks?subjectId=&status=&priorityLevelId=
  static async list(req: Request, res: Response) {
    const authReq = req as AuthRequest;
    const { subjectId, status, priorityLevelId } = req.query;

    try {
      const taskRepo = AppDataSource.getRepository(Task);

      const where: any = {
        user: { id: authReq.userId },
      };

      if (subjectId) {
        where.subject = { id: Number(subjectId) };
      }

      if (status && (status === 'pending' || status === 'done')) {
        where.status = status;
      }

      if (priorityLevelId) {
        where.priority = { id: Number(priorityLevelId) };
      }

      const tasks = await taskRepo.find({
        where,
        relations: ['subject', 'priority'],
        order: { dueDate: 'ASC' },
      });

      return res.json(tasks);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  // POST /api/tasks
  static async create(req: Request, res: Response) {
    const authReq = req as AuthRequest;
    const {
      title,
      description,
      dueDate,
      subjectId,
      priorityLevelId,
    } = req.body as {
      title?: string;
      description?: string;
      dueDate?: string;
      subjectId?: number;
      priorityLevelId?: number;
    };

    if (!title || title.trim().length < 2) {
      return res.status(400).json({ message: 'Title must be at least 2 characters' });
    }
    if (!subjectId) {
      return res.status(400).json({ message: 'subjectId is required' });
    }
    if (!priorityLevelId) {
      return res.status(400).json({ message: 'priorityLevelId is required' });
    }
    if (!dueDate) {
      return res.status(400).json({ message: 'dueDate is required' });
    }

    const due = new Date(dueDate);
    if (isNaN(due.getTime())) {
      return res.status(400).json({ message: 'Invalid dueDate format' });
    }

    try {
      const subjectRepo = AppDataSource.getRepository(Subject);
      const priorityRepo = AppDataSource.getRepository(PriorityLevel);
      const taskRepo = AppDataSource.getRepository(Task);

      const subject = await subjectRepo.findOne({
        where: { id: subjectId, user: { id: authReq.userId } },
      });
      if (!subject) {
        return res.status(404).json({ message: 'Subject not found' });
      }

      const priority = await priorityRepo.findOne({ where: { id: priorityLevelId } });
      if (!priority) {
        return res.status(400).json({ message: 'Invalid priorityLevelId' });
      }

      const task = taskRepo.create({
        title: title.trim(),
        description: description || '',
        dueDate: due,
        status: 'pending',
        subject,
        user: { id: authReq.userId! } as any,
        priority,
      });

      await taskRepo.save(task);
      const saved = await taskRepo.findOne({
        where: { id: task.id },
        relations: ['subject', 'priority'],
      });

      return res.status(201).json(saved);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  // PUT /api/tasks/:id
  static async update(req: Request, res: Response) {
    const authReq = req as AuthRequest;
    const id = Number(req.params.id);

    const {
      title,
      description,
      dueDate,
      status,
      subjectId,
      priorityLevelId,
    } = req.body as {
      title?: string;
      description?: string;
      dueDate?: string;
      status?: 'pending' | 'done';
      subjectId?: number;
      priorityLevelId?: number;
    };

    if (!id || Number.isNaN(id)) {
      return res.status(400).json({ message: 'Invalid task id' });
    }

    try {
      const taskRepo = AppDataSource.getRepository(Task);
      const subjectRepo = AppDataSource.getRepository(Subject);
      const priorityRepo = AppDataSource.getRepository(PriorityLevel);

      const task = await taskRepo.findOne({
        where: { id, user: { id: authReq.userId } },
        relations: ['subject', 'priority'],
      });

      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      if (title && title.trim().length >= 2) {
        task.title = title.trim();
      }
      if (description !== undefined) {
        task.description = description;
      }
      if (dueDate) {
        const newDue = new Date(dueDate);
        if (isNaN(newDue.getTime())) {
          return res.status(400).json({ message: 'Invalid dueDate format' });
        }
        task.dueDate = newDue;
      }
      if (status && (status === 'pending' || status === 'done')) {
        task.status = status;
      }
      if (subjectId) {
        const subject = await subjectRepo.findOne({
          where: { id: subjectId, user: { id: authReq.userId } },
        });
        if (!subject) {
          return res.status(404).json({ message: 'Subject not found' });
        }
        task.subject = subject;
      }
      if (priorityLevelId) {
        const priority = await priorityRepo.findOne({ where: { id: priorityLevelId } });
        if (!priority) {
          return res.status(400).json({ message: 'Invalid priorityLevelId' });
        }
        task.priority = priority;
      }

      await taskRepo.save(task);
      const saved = await taskRepo.findOne({
        where: { id: task.id },
        relations: ['subject', 'priority'],
      });

      return res.json(saved);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  // DELETE /api/tasks/:id
  static async remove(req: Request, res: Response) {
    const authReq = req as AuthRequest;
    const id = Number(req.params.id);

    if (!id || Number.isNaN(id)) {
      return res.status(400).json({ message: 'Invalid task id' });
    }

    try {
      const taskRepo = AppDataSource.getRepository(Task);
      const task = await taskRepo.findOne({
        where: { id, user: { id: authReq.userId } },
      });

      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      await taskRepo.remove(task);
      return res.status(204).send();
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  }
}
