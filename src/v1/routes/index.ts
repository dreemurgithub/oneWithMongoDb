// routes/index.ts - Main routes configuration
import { Router } from 'express';
import userRoutes from './userRoutes';
import taskRoutes from './taskRoutes';
import boardRoutes from './boardRoutes'

const routerV1 = Router();

// Health check route
routerV1.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Task Management API'
  });
});

// API version info
routerV1.get('/', (req, res) => {
  res.json({
    message: 'Task Management API',
    version: '1.0.0',
    endpoints: {
      users: '/users',
      tasks: '/tasks',
      health: '/health'
    }
  });
});

// Mount route modules
routerV1.use('/users', userRoutes);
routerV1.use('/tasks', taskRoutes);
routerV1.use('/boards', boardRoutes);

export default routerV1;