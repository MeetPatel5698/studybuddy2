import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import { validate } from 'class-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

class RegisterDto {
  username!: string;
  email!: string;
  password!: string;
}

export class AuthController {
  static async register(req: Request, res: Response) {
    const { username, email, password } = req.body as RegisterDto;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'username, email, and password are required' });
    }

    try {
      const userRepo = AppDataSource.getRepository(User);

      const existing = await userRepo.findOne({ where: [{ email }, { username }] });
      if (existing) {
        return res.status(409).json({ message: 'Username or email already in use' });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const user = userRepo.create({
        username,
        email,
        passwordHash,
        role: 'student',
      });

      await userRepo.save(user);
      return res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body as { email: string; password: string };

    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    try {
      const userRepo = AppDataSource.getRepository(User);
      const user = await userRepo.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const secret = process.env.JWT_SECRET || 'dev-secret';
      const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '1h' });

      return res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  static async profile(req: Request, res: Response) {
    // we'll cast to AuthRequest to read userId
    const authReq = req as any as { userId?: number };
    if (!authReq.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    try {
      const userRepo = AppDataSource.getRepository(User);
      const user = await userRepo.findOne({ where: { id: authReq.userId } });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  }
}
