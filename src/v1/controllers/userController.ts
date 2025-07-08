// controllers/userController.ts
import { Request, Response } from "express";
// import { UserService } from "@/services/userService";
import { User } from "@/models";

// Create a new user
export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username, name, password } = req.body;
  if (!username || !name || !password) {
    res.status(400);
    return;
  }
  const user = new User({ name, username, password });
  if(user){
    res.send(user)
    return
  }
  res.status(500).json({
    error: "Failed to create user",
  });
};

// Get user by ID
export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  res.status(500).json({
    error: "Failed to get user",
  });
};

// Get user with their tasks
export const getUserWithTasks = async (
  req: Request,
  res: Response
): Promise<void> => {
  res.status(500).json({
    error: "Failed to get user with tasks",
  });
};

// Get all users with pagination
export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  res.status(500).json({
    error: "Failed to get users",
  });
};

// Update user
export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  res.status(500).json({
    error: "Failed to update user",
  });
};

// Delete user
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  res.status(500).json({
    error: "Failed to delete user",
  });
};

// Get user's task statistics
export const getUserTaskStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  res.status(500).json({
    error: "Failed to get user task statistics",
  });
};
