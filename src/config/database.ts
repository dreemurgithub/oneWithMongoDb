import dotenv from "dotenv";
dotenv.config();
import mongoose from 'mongoose';

export async function createDatabaseIfNotExists(){
  mongoose.connect(`${process.env.MONGODB_URI}/taskmanager` );
}
