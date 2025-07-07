// routes/userRoutes.ts
import { Router } from 'express';
import {
  createUser,
  getUserById,
  getUserWithTasks,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserTaskStats
} from '@/v1/controllers/userController';

const router = Router();

// POST /api/users - Create a new user
router.post('/', createUser);

// GET /api/users - Get all users with pagination
router.get('/', getAllUsers);

// GET /api/users/:id - Get user by ID
router.get('/:id', getUserById);

// GET /api/users/:id/with-tasks - Get user with their tasks
router.get('/:id/with-tasks', getUserWithTasks);

// GET /api/users/:id/task-stats - Get user's task statistics
router.get('/:id/task-stats', getUserTaskStats);

// PUT /api/users/:id - Update user
router.put('/:id', updateUser);

// DELETE /api/users/:id - Delete user (and all their tasks)
router.delete('/:id', deleteUser);

export default router;