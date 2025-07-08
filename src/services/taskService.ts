import mongoose from 'mongoose';
import Task, { ITask } from '../models/Task';
import User from '../models/User';

export interface CreateTaskData {
  description: string;
  user: string | mongoose.Types.ObjectId;
  completed?: boolean;
}

export interface UpdateTaskData {
  description?: string;
  completed?: boolean;
}

export interface TaskFilters {
  userId?: string | mongoose.Types.ObjectId;
  completed?: boolean;
  search?: string; // Search in description
}

export class TaskService {

  /**
   * Create a new task for a user
   */
  static async createTask(taskData: CreateTaskData): Promise<ITask> {
    try {
      // Verify user exists
      const userExists = await User.findById(taskData.user);
      if (!userExists) {
        throw new Error('User not found');
      }

      const task = new Task(taskData);
      await task.save();
      
      // Populate user information before returning
      await task.populate('user', 'name username');
      return task;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to create task: ${error.message}`);
      }
      throw new Error('Failed to create task: Unknown error');
    }
  }

  /**
   * Get task by ID
   */
  static async getTaskById(taskId: string | mongoose.Types.ObjectId): Promise<ITask | null> {
    try {
      const task = await Task.findById(taskId).populate('user', 'name username');
      return task;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get task: ${error.message}`);
      }
      throw new Error('Failed to get task: Unknown error');
    }
  }

  /**
   * Get all tasks for a specific user
   */
  static async getTasksByUser(
    userId: string | mongoose.Types.ObjectId,
    page: number = 1,
    limit: number = 10,
    completed?: boolean
  ): Promise<{
    tasks: ITask[];
    total: number;
    page: number;
    pages: number;
  }> {
    try {
      const skip = (page - 1) * limit;
      const filter: any = { user: userId };
      
      if (completed !== undefined) {
        filter.completed = completed;
      }

      const [tasks, total] = await Promise.all([
        Task.find(filter)
          .populate('user', 'name username')
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 }),
        Task.countDocuments(filter)
      ]);

      return {
        tasks,
        total,
        page,
        pages: Math.ceil(total / limit)
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get tasks by user: ${error.message}`);
      }
      throw new Error('Failed to get tasks by user: Unknown error');
    }
  }

  /**
   * Get all tasks with filters and pagination
   */
  static async getAllTasks(
    filters: TaskFilters = {},
    page: number = 1,
    limit: number = 10
  ): Promise<{
    tasks: ITask[];
    total: number;
    page: number;
    pages: number;
  }> {
    try {
      const skip = (page - 1) * limit;
      const query: any = {};

      // Apply filters
      if (filters.userId) {
        query.user = filters.userId;
      }

      if (filters.completed !== undefined) {
        query.completed = filters.completed;
      }

      if (filters.search) {
        query.description = { $regex: filters.search, $options: 'i' };
      }

      const [tasks, total] = await Promise.all([
        Task.find(query)
          .populate('user', 'name username')
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 }),
        Task.countDocuments(query)
      ]);

      return {
        tasks,
        total,
        page,
        pages: Math.ceil(total / limit)
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get tasks: ${error.message}`);
      }
      throw new Error('Failed to get tasks: Unknown error');
    }
  }

  /**
   * Update task by ID
   */
  static async updateTask(
    taskId: string | mongoose.Types.ObjectId,
    updateData: UpdateTaskData
  ): Promise<ITask | null> {
    try {
      const task = await Task.findByIdAndUpdate(
        taskId,
        updateData,
        { new: true, runValidators: true }
      ).populate('user', 'name username');
      
      return task;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to update task: ${error.message}`);
      }
      throw new Error('Failed to update task: Unknown error');
    }
  }

  /**
   * Toggle task completion status
   */
  static async toggleTaskCompletion(taskId: string | mongoose.Types.ObjectId): Promise<ITask | null> {
    try {
      const task = await Task.findById(taskId);
      if (!task) {
        return null;
      }

      task.completed = !task.completed;
      await task.save();
      
      await task.populate('user', 'name username');
      return task;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to toggle task completion: ${error.message}`);
      }
      throw new Error('Failed to toggle task completion: Unknown error');
    }
  }

  /**
   * Delete task by ID
   */
  static async deleteTask(taskId: string | mongoose.Types.ObjectId): Promise<boolean> {
    try {
      const result = await Task.findByIdAndDelete(taskId);
      return !!result;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to delete task: ${error.message}`);
      }
      throw new Error('Failed to delete task: Unknown error');
    }
  }

  /**
   * Delete all tasks for a user
   */
  static async deleteTasksByUser(userId: string | mongoose.Types.ObjectId): Promise<number> {
    try {
      const result = await Task.deleteMany({ user: userId });
      return result.deletedCount || 0;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to delete tasks by user: ${error.message}`);
      }
      throw new Error('Failed to delete tasks by user: Unknown error');
    }
  }

  /**
   * Mark multiple tasks as completed
   */
  static async markTasksAsCompleted(taskIds: (string | mongoose.Types.ObjectId)[]): Promise<number> {
    try {
      const result = await Task.updateMany(
        { _id: { $in: taskIds } },
        { completed: true }
      );
      return result.modifiedCount || 0;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to mark tasks as completed: ${error.message}`);
      }
      throw new Error('Failed to mark tasks as completed: Unknown error');
    }
  }

  /**
   * Get task statistics for a user
   */
  static async getTaskStatsByUser(userId: string | mongoose.Types.ObjectId): Promise<{
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    completionRate: number;
    recentTasks: ITask[];
  }> {
    try {
      const [totalTasks, completedTasks, recentTasks] = await Promise.all([
        Task.countDocuments({ user: userId }),
        Task.countDocuments({ user: userId, completed: true }),
        Task.find({ user: userId })
          .populate('user', 'name username')
          .sort({ createdAt: -1 })
          .limit(5)
      ]);

      const pendingTasks = totalTasks - completedTasks;
      const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

      return {
        totalTasks,
        completedTasks,
        pendingTasks,
        completionRate: Math.round(completionRate * 100) / 100,
        recentTasks
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get task stats: ${error.message}`);
      }
      throw new Error('Failed to get task stats: Unknown error');
    }
  }

  /**
   * Search tasks by description
   */
  // static async searchTasks(
  //   searchTerm: string,
  //   userId?: string | mongoose.Types.ObjectId,
  //   page: number = 1,
  //   limit: number = 10
  // ): Promise<{
  //   tasks: ITask[];
  //   total: number;
  //   page: number;
  //   pages: number;
  // }> {
  //   try {
  //     const skip = (page - 1) * limit;
  //     const query: any = {
  //       description: { $regex: searchTerm, $options: 'i' }
  //     };

  //     if (userId) {
  //       query.user = userId;
  //     }

  //     const [tasks, total] = await Promise.all([
  //       Task.find(query)
  //         .populate('user', 'name username')
  //         .skip(skip)
  //         .limit(limit)
  //         .sort({ createdAt: -1 }),
  //       Task.countDocuments(query)
  //     ]);

  //     return {
  //       tasks,
  //       total,
  //       page,
  //       pages: Math.ceil(total / limit)
  //     };
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       throw new Error(`Failed to search tasks: ${error.message}`);
  //     }
  //     throw new Error('Failed to search tasks: Unknown error');
  //   }
  // }
}