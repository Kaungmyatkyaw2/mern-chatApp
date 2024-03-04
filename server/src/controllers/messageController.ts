import { RequestHandler } from "express";
import { Message, MessageModel } from "../models/messageModel";
import * as handlerFactory from "./handlerFactory";
import { catchAsync } from "../utils/catchAsync";
import { ConversationModel } from "../models/conversationModel";

const prepareToCreate: RequestHandler = (req, res, next) => {
  req.body.sender = req.user?._id;
  next();
};

const createMessage = catchAsync(async (req, res, next) => {
  let data = await MessageModel.create(req.body);

  data = await data.populate(["sender", "conversation"]);

  await ConversationModel.updateOne(
    { _id: data.conversation },
    { lastMessage: data._id, lastMsgAt: data.createdAt.getTime() }
  );

  res.status(201).json({
    status: "success",
    data,
  });
});

const prepareToGetMessages: RequestHandler = (req, res, next) => {
  const conversationId = req.params.conversation || req.query.conversation;
  req.query.conversation = conversationId;
  next();
};
const getMessages = handlerFactory.getAll<Message>(
  MessageModel,
  ["sender", "conversation"],
  true
);

export { createMessage, prepareToCreate, getMessages, prepareToGetMessages };
