import { RequestHandler } from "express";
import { createOne, getOne } from "./handlerFactory";
import { Conversation, ConversationModel } from "../models/conversationModel";
import { catchAsync } from "../utils/catchAsync";
import { UserModel } from "../models/userModel";
import AppError from "../utils/appError";
import * as handlerFactory from "./handlerFactory";

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
const createConversation: RequestHandler =
  createOne<Conversation>(ConversationModel);

const getConversations = handlerFactory.getAll(ConversationModel, [
  "members",
  "lastMessage",
]);

const prepareToGetConversations: RequestHandler = (req, res, next) => {
  const userId = req.user?._id;

  req.query.members = userId;

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
