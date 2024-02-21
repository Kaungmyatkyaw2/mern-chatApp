import { RequestHandler } from "express";
import { User, UserModel } from "../models/userModel";
import { getOne } from "./handlerFactory";

const setUserId: RequestHandler = (req, res, next) => {
  (req.params as { id: string }).id = req.user?._id || "";
  next();
};

const getUser: RequestHandler = getOne<User>(UserModel);

export { getUser, setUserId };
