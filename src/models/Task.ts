import mongoose, { Schema, Document, Model, PopulatedDoc } from 'mongoose';
import { IUser } from './User';

// Task interface for TypeScript
export interface ITask extends Document {
  _id: mongoose.Types.ObjectId;
  description: string;
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // user: PopulatedDoc<IUser>; // Can be ObjectId or populated User document
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Task Schema
const taskSchema = new Schema<ITask>({
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 400
  },
  // One-to-Many relationship: Each task belongs to one user
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // completed: {
  //   type: Boolean,
  //   default: false
  // }
}, {
  timestamps: true
});
taskSchema.set('toJSON', { virtuals: true });
taskSchema.set('toObject', { virtuals: true }); // ?

// Do this from inside the schema and with the model too, inside ref=> string
taskSchema.virtual('userInfo', {
  ref: 'User',
  localField: 'user',
  foreignField: '_id',
  justOne: true // Only one user per task
});

// Indexes for better query performance
// taskSchema.index({ user: 1 });
// taskSchema.index({ user: 1, completed: 1 });
// taskSchema.index({ createdAt: -1 });

// Create and export the Task model
// const Task: Model<ITask> = mongoose.model<ITask>('Task', taskSchema);

export default taskSchema;