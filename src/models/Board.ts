// models/Board.ts - Board model with Many-to-Many relationship to User
import mongoose, { Schema, Document, PopulatedDoc } from "mongoose";
import { IUser } from "./User";

// Board interface for TypeScript
export interface IBoard extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: true
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: true
  },
//   members: PopulatedDoc<IUser>[]; // Many-to-Many relationship with Users
//   owner: PopulatedDoc<IUser>; // Board owner (one User)
  createdAt: Date;
  updatedAt: Date;
}

// Board Schema definition
const boardSchema = new Schema<IBoard>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    // Many-to-Many relationship: Board can have multiple Users as members
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // One-to-Many relationship: Each board has one owner
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
boardSchema.virtual("users", {
  ref: "User", // The model to use
  localField: "members", // Find tasks where `localField`
  foreignField: "_id", // is equal to `foreignField`
});

// Indexes for better query performance
// boardSchema.index({ owner: 1 });
// boardSchema.index({ members: 1 });
// boardSchema.index({ name: 1, owner: 1 });
// boardSchema.index({ isPrivate: 1 });
// boardSchema.index({ createdAt: -1 });

// // Ensure owner is always included in members
// boardSchema.pre('save', function(next) {
//   // Add owner to members if not already included
//   if (!this.members.includes(this.owner)) {
//     this.members.push(this.owner);
//   }
//   next();
// });

// // Instance methods
// boardSchema.methods.addMember = function(userId: mongoose.Types.ObjectId) {
//   if (!this.members.includes(userId)) {
//     this.members.push(userId);
//     return this.save();
//   }
//   return Promise.resolve(this);
// };

// boardSchema.methods.removeMember = function(userId: mongoose.Types.ObjectId) {
//   // Don't allow removing the owner
//   if (this.owner.equals(userId)) {
//     throw new Error('Cannot remove board owner from members');
//   }

//   this.members = this.members.filter((memberId: mongoose.Types.ObjectId) =>
//     !memberId.equals(userId)
//   );
//   return this.save();
// };

// boardSchema.methods.isMember = function(userId: mongoose.Types.ObjectId): boolean {
//   return this.members.some((memberId: mongoose.Types.ObjectId) =>
//     memberId.equals(userId)
//   );
// };

// boardSchema.methods.isOwner = function(userId: mongoose.Types.ObjectId): boolean {
//   return this.owner.equals(userId);
// };

// // Static methods
// boardSchema.statics.findByMember = function(userId: mongoose.Types.ObjectId) {
//   return this.find({ members: userId }).populate('owner', 'name username').populate('members', 'name username');
// };

// boardSchema.statics.findByOwner = function(userId: mongoose.Types.ObjectId) {
//   return this.find({ owner: userId }).populate('members', 'name username');
// };

// boardSchema.statics.findPublicBoards = function() {
//   return this.find({ isPrivate: false }).populate('owner', 'name username').populate('members', 'name username');
// };

// Export the schema (not the model)
boardSchema.set('toJSON', { virtuals: true });
boardSchema.set('toObject', { virtuals: true }); // ?
export default boardSchema;
