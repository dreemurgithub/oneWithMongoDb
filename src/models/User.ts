import mongoose, { Schema, Document, Model } from "mongoose";
import dotenv from "dotenv";
dotenv.config();
// User interface for TypeScript
export interface IUser extends Document {
  // _id: mongoose.Types.ObjectId;
  username: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  taskList?: mongoose.Types.ObjectId[]; // Virtual field
}

// work, finally
const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      // trim: true,
      // minlength: 3,
      // maxlength: 30
    },
    password: {
      type: String,
      // required: true,
      // minlength: 6
    },
    name: {
      type: String,
      required: true,
      // trim: true,
      // maxlength: 100
    },
    taskList: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);
userSchema.set('toJSON', { virtuals: true }); // ?
userSchema.set('toObject', { virtuals: true }); // ?

// userSchema.virtual("tasks", {
//   ref: "Task", // Model to populate from
//   localField: "_id", // Field in User (this document)
//   foreignField: "user", // Field in Post that matches localField
// });


// these works
// const userSchema = new mongoose.Schema({
//   username: String,
//   password: String,
//   name: String
// });

// const userSchema = new Schema({
//   username: String,
//   password: String,
//   name: String,
// });

// Virtual field for User to get their tasks (One-to-Many relationship)
// userSchema.virtual('tasks', {
//   ref: 'Task', // The model to use
//   localField: '_id', // Find tasks where `localField`
//   foreignField: 'user' // is equal to `foreignField`
// });

// // Ensure virtual fields are serialized
// userSchema.set('toJSON', { virtuals: true });
// userSchema.set('toObject', { virtuals: true });

// // Cascade delete: Remove all tasks when user is deleted
// userSchema.pre('deleteOne', { document: true }, async function(next) {
//   try {
//     const Task = mongoose.model('Task');
//     await Task.deleteMany({ user: this._id });
//     next();
//   } catch (error) {
//     next(error as Error);
//   }
// });

// Create and export the User model
// const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
// console.log('here',process.env.MONGODB_URI)
// mongoose.connect(`${process.env.MONGODB_URI}/taskmanager`);
// export const User = mongoose.model("users", userSchema);

export default userSchema;
