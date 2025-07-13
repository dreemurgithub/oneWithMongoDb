import { HydratedDocument, Document } from "mongoose";
import { IUser } from "@/models/User";
import { User } from "@/models";
export const userSerializer = (object: IUser | IUser[]) => {
  if (Array.isArray(object)) {
    return object.map((u) => {
      return {
        id: u._id,
        username: u.username,
        name: u.name,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
      };
    });
  }
  return {
    id: object._id,
    username: object.username,
    name: object.name,
    createdAt: object.createdAt,
    updatedAt: object.updatedAt,
  };
};
