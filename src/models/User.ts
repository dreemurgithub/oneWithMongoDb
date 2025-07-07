import mongoose, { Schema, Document, Model } from 'mongoose';

// User interface for TypeScript
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  tasks?: mongoose.Types.ObjectId[]; // Virtual field
}

// User Schema
const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields automatically
});

// Virtual field for User to get their tasks (One-to-Many relationship)
userSchema.virtual('tasks', {
  ref: 'Task', // The model to use
  localField: '_id', // Find tasks where `localField`
  foreignField: 'user' // is equal to `foreignField`
});

// Ensure virtual fields are serialized
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

// Cascade delete: Remove all tasks when user is deleted
userSchema.pre('deleteOne', { document: true }, async function(next) {
  try {
    const Task = mongoose.model('Task');
    await Task.deleteMany({ user: this._id });
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Create and export the User model
const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;