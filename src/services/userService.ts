// services/userService.ts - Updated to use model registry
import mongoose from 'mongoose';
import { IUser } from '@/models/User';
import { User,Task } from '@/models';

export interface CreateUserData {
  username: string;
  password: string;
  name: string;
}

export interface UpdateUserData {
  username?: string;
  password?: string;
  name?: string;
}

export class UserService {
  
  /**
   * Create a new user
   */
  static async createUser(userData: CreateUserData): Promise<IUser> {
    const existingUser = await this.getUserByUsername(userData.username);
    if (existingUser) {
      throw new Error('Username already exists');
    }

    const user = new User(userData);
    await user.save();
    return user;
  }

  /**
   * Get user by ID
   */
  static async getUserById(userId: string | mongoose.Types.ObjectId): Promise<IUser | null> {
    try {
      const user = await User.findById(userId);
      return user;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get user: ${error.message}`);
      }
      throw new Error('Failed to get user: Unknown error');
    }
  }

  /**
   * Get user by username (null return is expected, not an error)
   */
  static async getUserByUsername(username: string): Promise<IUser | null> {
    try {
      return await User.findOne({ username });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Database error while finding user: ${error.message}`);
      }
      throw new Error('Database error while finding user: Unknown error');
    }
  }

  /**
   * Get user with their tasks populated
   */
  static async getUserWithTasks(userId: string | mongoose.Types.ObjectId): Promise<IUser | null> {
    try {
      const user = await User.findById(userId).populate({
        path: 'tasks',
        options: { sort: { createdAt: -1 } }
      });
      return user;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get user with tasks: ${error.message}`);
      }
      throw new Error('Failed to get user with tasks: Unknown error');
    }
  }

  /**
   * Get all users with pagination
   */
  static async getAllUsers(page: number = 1, limit: number = 10): Promise<{
    users: IUser[];
    total: number;
    page: number;
    pages: number;
  }> {
    try {
      const skip = (page - 1) * limit;
      
      const [users, total] = await Promise.all([
        User.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
        User.countDocuments()
      ]);

      return {
        users,
        total,
        page,
        pages: Math.ceil(total / limit)
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get users: ${error.message}`);
      }
      throw new Error('Failed to get users: Unknown error');
    }
  }

  /**
   * Update user by ID
   */
  static async updateUser(
    userId: string | mongoose.Types.ObjectId, 
    updateData: UpdateUserData
  ): Promise<IUser | null> {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true, runValidators: true }
      );
      return user;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to update user: ${error.message}`);
      }
      throw new Error('Failed to update user: Unknown error');
    }
  }

  /**
   * Delete user by ID (will cascade delete all user's tasks)
   */
  static async deleteUser(userId: string | mongoose.Types.ObjectId): Promise<boolean> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return false;
      }
      
      // This will trigger the pre-delete hook to remove tasks
      await user.deleteOne();
      return true;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to delete user: ${error.message}`);
      }
      throw new Error('Failed to delete user: Unknown error');
    }
  }

  /**
   * Check if username exists (returns boolean, not an error)
   */
  static async usernameExists(username: string): Promise<boolean> {
    try {
      const user = await this.getUserByUsername(username);
      return !!user;
    } catch (error) {
      // If there's a database error, re-throw it
      throw error;
    }
  }

  /**
   * Get user's task statistics
   */
  static async getUserTaskStats(userId: string | mongoose.Types.ObjectId): Promise<{
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    completionRate: number;
  }> {
    try {
      const [totalTasks, completedTasks] = await Promise.all([
        Task.countDocuments({ user: userId }),
        Task.countDocuments({ user: userId, completed: true })
      ]);

      const pendingTasks = totalTasks - completedTasks;
      const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

      return {
        totalTasks,
        completedTasks,
        pendingTasks,
        completionRate: Math.round(completionRate * 100) / 100
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get user task stats: ${error.message}`);
      }
      throw new Error('Failed to get user task stats: Unknown error');
    }
  }
}