// controllers/taskController.ts
import { Request, Response } from "express";
import { Task, User, Board } from "@/models";
// import { UserService } from '@/services/userService';

export const createBoard = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { ownerId, description, name } = req.body;
  const user = await User.findById(ownerId);
  if (user) {
    const board = new Board({
      description,
      name,
      owner: ownerId,
    });
    board.save();
    res.send(board);
    return;
  }
  res.status(500).json({
    error: "Failed to create board",
  });
};

// Get task by ID
export const getBoardById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const board = await Board.findById(id).populate("ownerInfor"); // const task = await Task.findById(id)
  if (board) {
    res.send(board);
    return;
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

// Update Board
export const updateBoard = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { description, name } = req.body;
  const board = await Board.findById(id).populate("ownerInfor").populate('users')
  if (board) {
    board.description = description;
    board.name = name;
    res.send(board);
    return;
  }
  res.status(500).json({
    error: "Failed to update Board",
  });
};

// Toggle Board completion
export const addMemberToBoard = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { userId } = req.body;
  const board = await Board.findById(id).populate("users").populate('ownerInfor'); // const task = await Task.findById(id)
  const user = await User.findById(userId)
  if (board && user ) {
    if(board.owner.toString() !== user.id && !board.members.includes(user.id)){
      board.members.push(user.id)
      board.save()
    }
    res.send(board);
    return;
  }
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
