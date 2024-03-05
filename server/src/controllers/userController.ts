import { RequestHandler } from "express";
import { User, UserModel } from "../models/userModel";
import { getOne, getAll } from "./handlerFactory";
import { catchAsync } from "../utils/catchAsync";
import ApiFeatures from "../utils/apiFeatures";
import AppError from "../utils/appError";

const setUserId: RequestHandler = (req, res, next) => {
  (req.params as { id: string }).id = req.user?._id || "";
  next();
};

const getUser: RequestHandler = getOne<User>(UserModel);
const getUsers = getAll<User>(UserModel);
const getUsersBySearching = catchAsync(async (req, res, next) => {
  const email = new RegExp(`${req.query.email}`, "i");

  let query = new ApiFeatures<User>(UserModel.find({ email: email }), req.query)
    .sort()
    .paginate();
  let data = await query.query;

  res.status(200).json({
    status: "success",
    results: data.length,
    data: data,
  });
});

const updateMe = catchAsync(async (req, res, next) => {
  const { name, picture } = req.body;
  if (!name && !picture) {
    return next(new AppError("Please provide info to update!", 400));
  }

  let payload = {};

  if (name) {
    payload = { ...payload, name };
  }
  if (picture) {
    payload = { ...payload, picture };
  }

  const user = await UserModel.findByIdAndUpdate(req.user?._id, payload, {
    returnDocument: "after",
  });

  res.status(200).json({
    status: "success",
    data: user,
  });
});

export { getUser, setUserId, getUsers, getUsersBySearching, updateMe };
