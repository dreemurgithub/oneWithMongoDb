// controllers/userController.ts
import { Request, Response } from 'express';
import { UserService } from '@/services/userService';

// Create a new user
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password, name } = req.body;

    // Basic validation
    if (!username || !password || !name) {
      res.status(400).json({ 
        error: 'Username, password, and name are required' 
      });
      return;
    }

    // Check if username already exists
    const existingUser = await UserService.getUserByUsername(username);
    if (existingUser) {
      res.status(409).json({ 
        error: 'Username already exists' 
      });
      return;
    }

    const user = await UserService.createUser({ username, password, name });
    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to create user',
      details: (error as Error).message 
    });
  }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await UserService.getUserById(id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to get user',
      details: (error as Error).message 
    });
  }
};

// Get user with their tasks
export const getUserWithTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await UserService.getUserWithTasks(id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        tasks: user.tasks
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to get user with tasks',
      details: (error as Error).message 
    });
  }
};

// Get all users with pagination
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await UserService.getAllUsers(page, limit);
    
    res.json({
      users: result.users.map(user => ({
        id: user._id,
        username: user.username,
        name: user.name,
        createdAt: user.createdAt
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
      error: 'Failed to get users',
      details: (error as Error).message 
    });
  }
};

// Update user
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { username, password, name } = req.body;

    // Check if user exists
    const existingUser = await UserService.getUserById(id);
    if (!existingUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Check if new username is already taken (if username is being updated)
    if (username && username !== existingUser.username) {
      const userWithUsername = await UserService.getUserByUsername(username);
      if (userWithUsername) {
        res.status(409).json({ error: 'Username already exists' });
        return;
      }
    }

    const updateData: any = {};
    if (username) updateData.username = username;
    if (password) updateData.password = password;
    if (name) updateData.name = name;

    const updatedUser = await UserService.updateUser(id, updateData);
    
    res.json({
      message: 'User updated successfully',
      user: {
        id: updatedUser!._id,
        username: updatedUser!.username,
        name: updatedUser!.name,
        updatedAt: updatedUser!.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to update user',
      details: (error as Error).message 
    });
  }
};

// Delete user
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const deleted = await UserService.deleteUser(id);
    if (!deleted) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ 
      message: 'User and all associated tasks deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to delete user',
      details: (error as Error).message 
    });
  }
};

// Get user's task statistics
export const getUserTaskStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Check if user exists
    const user = await UserService.getUserById(id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const stats = await UserService.getUserTaskStats(id);
    
    res.json({
      user: {
        id: user._id,
        username: user.username,
        name: user.name
      },
      taskStats: stats
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to get user task statistics',
      details: (error as Error).message 
    });
  }
};