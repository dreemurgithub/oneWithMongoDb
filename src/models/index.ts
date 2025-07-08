import dotenv from "dotenv";
dotenv.config();
import mongoose, { Schema, Document, Model } from "mongoose";

mongoose.connect(`${process.env.MONGODB_URI}/taskmanager`);

// Import schemas
import userSchema, { IUser } from "./User";
import taskSchema, { ITask } from "./Task";

// Global model variables
// let User: mongoose.Model<IUser> | null = null;
// let Task: mongoose.Model<ITask> | null = null;
export const Task = mongoose.model("tasks", taskSchema);
// export const Task: Model<ITask> = mongoose.model<ITask>('tasks', taskSchema);
export const User = mongoose.model("users", userSchema);
// export const User: Model<IUser> = mongoose.model<IUser>('users', userSchema);
