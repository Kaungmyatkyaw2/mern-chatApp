import { RequestHandler } from "express";
import { getOne } from "./handlerFactory";
import { Conversation, ConversationModel } from "../models/conversationModel";
import { catchAsync } from "../utils/catchAsync";
import { UserModel } from "../models/userModel";
import AppError from "../utils/appError";

const prepareToCreate: RequestHandler = (req, res, next) => {
  (req.body as { members: string[] }).members = [
    ...req.body.members.filter((i: string) => i != req.user?.email),
    req.user?.email,
  ];
  next();
};

const CollectMebersId: RequestHandler = catchAsync(async (req, res, next) => {
  const MembersId = await Promise.all(
    (req.body as { members: string[] }).members.map(async (el) => {
      const user = await UserModel.findOne({ email: el });

      if (!user) {
        return next(new AppError(`User ${el} is not exist`, 404));
      }

      return user._id;
    })
  );

  req.body.members = MembersId;
  req.body.name = req.body.name || "userConversation";

  next();
});

const getConversation: RequestHandler = getOne<Conversation>(
  ConversationModel,
  "members"
);
const createConversation: RequestHandler = catchAsync(
  async (req, res, next) => {
    let data = await ConversationModel.create(req.body);

    data = await data.populate("members");

    res.status(201).json({
      status: "success",
      data,
    });
  }
);
const getConversations = catchAsync(async (req, res, next) => {
  let data = await ConversationModel.aggregate([
    {
      $match: {
        members: req.user?._id,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "members",
        foreignField: "_id",
        as: "members",
      },
    },
    {
      $lookup: {
        from: "messages",
        localField: "lastMessage",
        foreignField: "_id",
        as: "lastMessageArray",
      },
    },
    {
      $sort: {
        "lastMessageArray.createdAt": -1,
      },
    },
    {
      $addFields: {
        lastMessage: { $arrayElemAt: ["$lastMessageArray", 0] },
      },
    },
    {
      $project: {
        lastMessageArray: 0,
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    results: data.length,
    data,
  });
});

const prepareToGetConversations: RequestHandler = (req, res, next) => {
  const userId = req.user?._id;

  req.query.members = userId;
  req.query.sort = "-lastMessage.createdAt";

  next();
};

export {
  getConversation,
  createConversation,
  prepareToCreate,
  prepareToGetConversations,
  getConversations,
  CollectMebersId,
};
