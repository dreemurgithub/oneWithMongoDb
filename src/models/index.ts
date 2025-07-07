// Alternative approach: models/index.ts - Direct model exports
import mongoose from 'mongoose';
import { createDatabaseIfNotExists } from '../config/database';

// Import schemas
import userSchema, { IUser } from './User';
import taskSchema, { ITask } from './Task';

// Global model variables
let User: mongoose.Model<IUser> | null = null;
let Task: mongoose.Model<ITask> | null = null;

// Initialize models after database connection
export const initializeModels = async() => {
  await createDatabaseIfNotExists()

  console.log('✅ Models initialized successfully');
};

// Get User model
export const getUserModel = (): mongoose.Model<IUser> => {
  if (!User) {
    throw new Error('User model not initialized. Call initializeModels() first.');
  }
  return User;
};

// Get Task model  
export const getTaskModel = (): mongoose.Model<ITask> => {
  if (!Task) {
    throw new Error('Task model not initialized. Call initializeModels() first.');
  }
  return Task;
};

// Check if models are initialized
export const areModelsInitialized = (): boolean => {
  return !!(User && Task);
};

// Get all models (optional, for convenience)
export const getAllModels = () => {
  return {
    User: getUserModel(),
    Task: getTaskModel()
  };
};

// Export types
export type { IUser } from './User';
export type { ITask } from './Task';