// controllers/taskController.ts
import { Request, Response } from "express";
import { Task,User } from "@/models";
// import { TaskService } from '@/services/taskService';
// import { UserService } from '@/services/userService';

// Create a new task
export const createTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try{
    const { userId, description } = req.body;
    const user = await User.findById(userId)
    if(user){
      const task = new Task({
        description,
        user: user._id
      })
      task.save()
      res.send(task)
      return
    }
  } catch(error){
    res.status(400).json({
      error
    });
  }
};

// Get task by ID
export const getTaskById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try{
    const {id} = req.params
    const task = await Task.findById(id).populate('userInfo')
    // const task = await Task.findById(id)
    if(task){
      res.send(task)
      return
    }
  } catch(error){
    res.status(400).json({
      error
    });
  }
};

// Get all tasks with filters and pagination
export const getAllTasks = async (
  req: Request,
  res: Response
): Promise<void> => {
  res.status(400).json({
    error: "Failed to get tasks",
  });
};

// Get tasks by user ID
export const getTasksByUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  res.status(400).json({
    error: "Failed to get user tasks",
  });
};

// Update task
export const updateTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { description, completed } = req.body;
  } catch (error) {
    res.status(400).json({
      error
    });
  }

};

// Toggle task completion
export const toggleTaskCompletion = async (
  req: Request,
  res: Response
): Promise<void> => {
  res.status(400).json({
    error: "Failed to toggle task completion",
  });
};

// Delete task
export const deleteTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  res.status(400).json({
    error: "Failed to delete task",
  });
};

// Mark multiple tasks as completed
export const markTasksAsCompleted = async (
  req: Request,
  res: Response
): Promise<void> => {
  res.status(400).json({
    error: "Failed to mark tasks as completed",
  });
};

// Search tasks
export const searchTasks = async (
  req: Request,
  res: Response
): Promise<void> => {
  res.status(400).json({
    error: "Failed to search tasks",
  });
};

// Get task statistics for a user
export const getTaskStatsByUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  res.status(400).json({
    error: "Failed to get task statistics",
  });
};
