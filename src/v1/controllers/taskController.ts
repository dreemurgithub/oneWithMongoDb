// controllers/taskController.ts
import { Request, Response } from 'express';
import { TaskService } from '@/services/taskService';
import { UserService } from '@/services/userService';

// Create a new task
export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { description, user, completed } = req.body;

    // Basic validation
    if (!description || !user) {
      res.status(400).json({ 
        error: 'Description and user are required' 
      });
      return;
    }

    // Check if user exists
    const userExists = await UserService.getUserById(user);
    if (!userExists) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const task = await TaskService.createTask({ description, user, completed });
    
    res.status(201).json({
      message: 'Task created successfully',
      task: {
        id: task._id,
        description: task.description,
        completed: task.completed,
        user: task.user,
        createdAt: task.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to create task',
      details: (error as Error).message 
    });
  }
};

// Get task by ID
export const getTaskById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const task = await TaskService.getTaskById(id);
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    res.json({
      task: {
        id: task._id,
        description: task.description,
        completed: task.completed,
        user: task.user,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to get task',
      details: (error as Error).message 
    });
  }
};

// Get all tasks with filters and pagination
export const getAllTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const userId = req.query.userId as string;
    const completed = req.query.completed === 'true' ? true : 
                     req.query.completed === 'false' ? false : undefined;
    const search = req.query.search as string;

    const filters = {
      ...(userId && { userId }),
      ...(completed !== undefined && { completed }),
      ...(search && { search })
    };

    const result = await TaskService.getAllTasks(filters, page, limit);
    
    res.json({
      tasks: result.tasks.map(task => ({
        id: task._id,
        description: task.description,
        completed: task.completed,
        user: task.user,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt
      })),
      pagination: {
        page: result.page,
        pages: result.pages,
        total: result.total,
        limit
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to get tasks',
      details: (error as Error).message 
    });
  }
};

// Get tasks by user ID
export const getTasksByUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const completed = req.query.completed === 'true' ? true : 
                     req.query.completed === 'false' ? false : undefined;

    // Check if user exists
    const userExists = await UserService.getUserById(userId);
    if (!userExists) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const result = await TaskService.getTasksByUser(userId, page, limit, completed);
    
    res.json({
      user: {
        id: userExists._id,
        username: userExists.username,
        name: userExists.name
      },
      tasks: result.tasks.map(task => ({
        id: task._id,
        description: task.description,
        completed: task.completed,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt
      })),
      pagination: {
        page: result.page,
        pages: result.pages,
        total: result.total,
        limit
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to get user tasks',
      details: (error as Error).message 
    });
  }
};

// Update task
export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { description, completed } = req.body;

    // Check if task exists
    const existingTask = await TaskService.getTaskById(id);
    if (!existingTask) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    const updateData: any = {};
    if (description !== undefined) updateData.description = description;
    if (completed !== undefined) updateData.completed = completed;

    const updatedTask = await TaskService.updateTask(id, updateData);
    
    res.json({
      message: 'Task updated successfully',
      task: {
        id: updatedTask!._id,
        description: updatedTask!.description,
        completed: updatedTask!.completed,
        user: updatedTask!.user,
        updatedAt: updatedTask!.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to update task',
      details: (error as Error).message 
    });
  }
};

// Toggle task completion
export const toggleTaskCompletion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const task = await TaskService.toggleTaskCompletion(id);
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    res.json({
      message: `Task marked as ${task.completed ? 'completed' : 'pending'}`,
      task: {
        id: task._id,
        description: task.description,
        completed: task.completed,
        user: task.user,
        updatedAt: task.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to toggle task completion',
      details: (error as Error).message 
    });
  }
};

// Delete task
export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const deleted = await TaskService.deleteTask(id);
    if (!deleted) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    res.json({ 
      message: 'Task deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to delete task',
      details: (error as Error).message 
    });
  }
};

// Mark multiple tasks as completed
export const markTasksAsCompleted = async (req: Request, res: Response): Promise<void> => {
  try {
    const { taskIds } = req.body;

    if (!Array.isArray(taskIds) || taskIds.length === 0) {
      res.status(400).json({ 
        error: 'taskIds must be a non-empty array' 
      });
      return;
    }

    const updatedCount = await TaskService.markTasksAsCompleted(taskIds);
    
    res.json({
      message: `${updatedCount} task(s) marked as completed`,
      updatedCount
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to mark tasks as completed',
      details: (error as Error).message 
    });
  }
};

// Search tasks
export const searchTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q: searchTerm } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const userId = req.query.userId as string;

    if (!searchTerm || typeof searchTerm !== 'string') {
      res.status(400).json({ 
        error: 'Search term (q) is required' 
      });
      return;
    }

    // const result = await TaskService.searchTasks(searchTerm, userId, page, limit);
    
    // res.json({
    //   searchTerm,
    //   tasks: result.tasks.map(task => ({
    //     id: task._id,
    //     description: task.description,
    //     completed: task.completed,
    //     user: task.user,
    //     createdAt: task.createdAt
    //   })),
    //   pagination: {
    //     page: result.page,
    //     pages: result.pages,
    //     total: result.total,
    //     limit
    //   }
    // });
    res.send({
      page,limit,userId
    })
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to search tasks',
      details: (error as Error).message 
    });
  }
};

// Get task statistics for a user
export const getTaskStatsByUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    // Check if user exists
    const userExists = await UserService.getUserById(userId);
    if (!userExists) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const stats = await TaskService.getTaskStatsByUser(userId);
    
    res.json({
      user: {
        id: userExists._id,
        username: userExists.username,
        name: userExists.name
      },
      stats
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to get task statistics',
      details: (error as Error).message 
    });
  }
};