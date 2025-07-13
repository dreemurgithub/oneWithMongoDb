// controllers/taskController.ts
import { Request, Response } from "express";
import { Task,User,Board } from "@/models";
// import { UserService } from '@/services/userService';

export const createBoard = async (
  req: Request,
  res: Response
): Promise<void> => {
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
  res.status(500).json({
    error: "Failed to create task",
  });
};

// Get task by ID
export const getBoardById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {id} = req.params
  const task = await Task.findById(id).populate('userInfo')
  // const task = await Task.findById(id)
  if(task){
    res.send(task)
    return
  }
  res.status(500).json({
    error: "Failed to get task",
  });
};

// Get all tasks with filters and pagination
export const getAllBoards = async (
  req: Request,
  res: Response
): Promise<void> => {
  res.status(500).json({
    error: "Failed to get Boards",
  });
};

// Get Boards by user ID
export const getBoardsByUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  res.status(500).json({
    error: "Failed to get user Boards",
  });
};

// Update task
export const updateBoard = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { description, completed } = req.body;

  res.status(500).json({
    error: "Failed to update Board",
  });
};

// Toggle Board completion
export const toggleBoardCompletion = async (
  req: Request,
  res: Response
): Promise<void> => {
  res.status(500).json({
    error: "Failed to toggle Board completion",
  });
};

// Delete Board
export const deleteBoard = async (
  req: Request,
  res: Response
): Promise<void> => {
  res.status(500).json({
    error: "Failed to delete Board",
  });
};

// Mark multiple Boards as completed
export const markBoardsAsCompleted = async (
  req: Request,
  res: Response
): Promise<void> => {
  res.status(500).json({
    error: "Failed to mark Boards as completed",
  });
};

// Search Boards
export const searchBoards = async (
  req: Request,
  res: Response
): Promise<void> => {
  res.status(500).json({
    error: "Failed to search Boards",
  });
};

// Get Board statistics for a user
export const getBoardstatsByUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  res.status(500).json({
    error: "Failed to get Board statistics",
  });
};
