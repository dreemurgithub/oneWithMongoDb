import { HydratedDocument, Document,PopulatedDoc } from "mongoose";
import { IUser } from "@/models/User";
import { User } from "@/models";
import { IBoard } from "@/models/Board";
import { ITask } from "@/models/Task";

interface IUserPopulated extends Omit<IUser, 'tasks' | 'boards'> {
  tasks?: PopulatedDoc<ITask>[];
  boards?: PopulatedDoc<IBoard>[];
}


export const userSerializer = (object: IUserPopulated | IUserPopulated[]) => {
  if (Array.isArray(object)) {
    return object.map((u) => {
      return {
        id: u._id,
        username: u.username,
        name: u.name,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
        tasks: u.tasks
      };
    });
  }
  return {
    id: object._id,
    username: object.username,
    name: object.name,
    createdAt: object.createdAt,
    updatedAt: object.updatedAt,
    tasks: object.tasks
  };
};
