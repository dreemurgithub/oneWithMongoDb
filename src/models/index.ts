import dotenv from "dotenv";
dotenv.config();
import mongoose, { Schema, Document, Model } from "mongoose";

mongoose.connect(`${process.env.MONGODB_URI}/taskmanager`);
mongoose.set("strictPopulate", false); // to populate, a must, it work

// Import schemas
import userSchema, { IUser } from "./User";
import taskSchema, { ITask } from "./Task";
import boardSchema, { IBoard } from "./Board";

// Global model variables
// let User: mongoose.Model<IUser> | null = null;
// let Task: mongoose.Model<ITask> | null = null;
export const Task = mongoose.model("tasks", taskSchema);
// export const Task: Model<ITask> = mongoose.model<ITask>('tasks', taskSchema);
export const User = mongoose.model("users", userSchema);
export const Board = mongoose.model("boards", boardSchema);

userSchema.virtual("tasks", {
  ref: Task, // we can refer to string, but dont
  localField: "_id", // Field in User (this document)
  foreignField: "user", // Field in Post that matches localField
});
userSchema.virtual("boards", {
  ref: Board, // The model to use
  localField: "_id", // Find tasks where `localField`
  foreignField: "members", // is equal to `foreignField`
});

taskSchema.virtual("userInfo", {
  ref: User,
  localField: "user",
  foreignField: "_id",
  justOne: true, // Only one user per task
});
boardSchema.virtual("owernerInfor", {
  ref: User,
  justOne: true,
  foreignField: "_id",
  localField: "owner",
});
boardSchema.virtual("users", {
  ref: User, // The model to use
  localField: "members", // Find tasks where `localField`
  foreignField: "_id", // is equal to `foreignField`
});

