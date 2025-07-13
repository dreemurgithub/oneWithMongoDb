// controllers/userController.ts
import { Request, Response } from "express";
// import { UserService } from "@/services/userService";
import { User, Task } from "@/models";

// Create a new user
export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username, name, password } = req.body;
    if (!username || !name || !password) {
      res.status(400);
      return;
    }
    const user = new User({ name, username, password });
    if (user) {
      await user.save();
      res.send(user);
      return;
    }
  } catch(error){
    res.status(500).json({
      error
    });

  }
};

// Get user by ID
export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    // const tasks = await Task.find({ user: id });
    // Task;
    const user = await User.findById(id).populate('tasks').populate('boards')
    // const user = await User.findById(id)
    if (user) {
      res.send(user);
      return;
    }
  } catch(error){
    res.status(500).json({
      error,
    });
  }
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
  const users = await User.find().populate('tasks');
  res.send(users);
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
