import authRoutes from './routes/authRoutes';
import subjectRoutes from './routes/subjectRoutes';
import priorityRoutes from './routes/priorityRoutes';
import taskRoutes from './routes/taskRoutes';

import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AppDataSource } from './data-source';


dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use('/api', authRoutes);
app.use('/api', subjectRoutes);
app.use('/api', priorityRoutes);
app.use('/api', taskRoutes);



// Simple health route (keep it)
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'StudyBuddy backend is running' });
});

// TODO: we'll add auth/subjects/tasks routes here later

AppDataSource.initialize()
  .then(async () => {
    console.log('📦 DataSource initialized');

    // Seed priority levels if empty
    const priorityRepo = AppDataSource.getRepository('PriorityLevel');
    const count = await priorityRepo.count();
    if (count === 0) {
      await priorityRepo.insert([
        { name: 'Low', color: '#6c757d', sortOrder: 1 },
        { name: 'Medium', color: '#17a2b8', sortOrder: 2 },
        { name: 'High', color: '#dc3545', sortOrder: 3 },
      ]);
      console.log('✨ Seeded PriorityLevel lookup');
    }

    app.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('❌ Error during DataSource initialization', err);
  });
