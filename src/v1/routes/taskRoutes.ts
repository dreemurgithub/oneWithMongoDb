// routes/taskRoutes.ts
import { Router } from 'express';
import {
  createTask,
  getTaskById,
  getAllTasks,
  getTasksByUser,
  updateTask,
  toggleTaskCompletion,
  deleteTask,
  markTasksAsCompleted,
  searchTasks,
  getTaskStatsByUser
} from '@/v1/controllers/taskController';

const router = Router();

// POST /api/tasks - Create a new task
router.post('/', createTask);

// GET /api/tasks - Get all tasks with filters and pagination
router.get('/', getAllTasks);

// GET /api/tasks/search - Search tasks by description
router.get('/search', searchTasks);

// GET /api/tasks/:id - Get task by ID
router.get('/:id', getTaskById);

// GET /api/tasks/user/:userId - Get all tasks for a specific user
router.get('/user/:userId', getTasksByUser);

// GET /api/tasks/user/:userId/stats - Get task statistics for a user
router.get('/user/:userId/stats', getTaskStatsByUser);

// PUT /api/tasks/:id - Update task
router.put('/:id', updateTask);

// PATCH /api/tasks/:id/toggle - Toggle task completion status
router.patch('/:id/toggle', toggleTaskCompletion);

// PATCH /api/tasks/mark-completed - Mark multiple tasks as completed
router.patch('/mark-completed', markTasksAsCompleted);

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', deleteTask);

export default router;