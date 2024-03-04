import { NextFunction, Request, RequestHandler, Response } from "express";
import { getOne } from "./handlerFactory";
import { Conversation, ConversationModel } from "../models/conversationModel";
import { catchAsync } from "../utils/catchAsync";
import { User, UserModel } from "../models/userModel";
import AppError from "../utils/appError";

const prepareToCreate: RequestHandler = (req, res, next) => {
  (req.body as { members: string[] }).members = [
    ...req.body.members.filter((i: string) => i != req.user?.email),
    req.user?.email,
  ];

  req.body.admins = [req.user?._id];

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

const prepareToGetConversations: RequestHandler = (req, res, next) => {
  const userId = req.user?._id;

  req.query.members = userId;
  req.query.sort = "-lastMessage.createdAt";

  next();
};

const getConversation: RequestHandler = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  let data = await ConversationModel.findOne({
    _id: id,
    members: req.user?._id,
  }).populate({
    path: "members",
    options: {
      sort: "createdAt",
    },
  });

  if (!data) {
    return next(new AppError("No conversation is found with this id!", 404));
  }

  res.status(200).json({
    status: "success",
    data,
  });
});

const createConversation: RequestHandler = catchAsync(
  async (req, res, next) => {
    let data = await ConversationModel.create(req.body);

    data = await data.populate({
      path: "members",
      options: {
        sort: "createdAt",
      },
    });

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

const deleteConversation: RequestHandler = catchAsync(
  async (req, res, next) => {
    const id = req.params.id;

    const conv = await ConversationModel.findById(id);

    if (!conv) {
      return next(new AppError("No conversation is found with this id!", 404));
    }

    const isMeAdmin = conv.admins?.some((el) => el.toString() == req.user?._id);

    const isAbleToDelete = !conv?.isGroup || isMeAdmin;

    if (!isAbleToDelete) {
      return next(
        new AppError("You don't have permission to delete conversation.", 401)
      );
    }

    await ConversationModel.findByIdAndDelete(id);

    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);

const leaveConversation: RequestHandler = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  let conv = await ConversationModel.findById(id);

  if (!conv) {
    return next(new AppError("No conversation is found with this id!", 404));
  }

  const filterMember = (i: string | User) =>
    i.toString() !== req.user?._id.toString();

  conv.members = conv.members.filter(filterMember);
  conv.admins = conv.admins.filter(filterMember);

  if (conv.admins.length == 0) {
    conv.admins = conv.members;
  }

  await conv.save({ validateBeforeSave: false });
  conv = await conv.populate({
    path: "members",
    options: {
      sort: "createdAt",
    },
  });

  res.status(200).json({
    status: "success",
    data: conv,
  });
});

// Admin Access Methods

type MutateConv = (
  conv: Conversation,
  req: Request,
  res: Response,
  next: NextFunction
) => void;

const updateConvIsAdmin = (fn: MutateConv) =>
  catchAsync(async (req, res, next) => {
    const id = req.params.id;

    let conv = await ConversationModel.findById(id);

    if (!conv) {
      return next(new AppError("No conversation is found with this id!", 404));
    }

    const isMeAdmin = conv.admins?.some((el) => el.toString() == req.user?._id);

    if (!isMeAdmin) {
      return next(
        new AppError("You don't have permission to perform this request!", 403)
      );
    }

    fn(conv, req, res, next);

    await conv.save({ validateBeforeSave: false });
    conv = await conv.populate({
      path: "members",
      options: {
        sort: "createdAt",
      },
    });

    res.status(200).json({
      status: "success",
      data: conv,
    });
  });

const updateConversation: RequestHandler = updateConvIsAdmin(
  (conv, req, _, next) => {
    if (!req.body.name) {
      return next(new AppError("Please provide required info!", 400));
    }
    conv.name = req.body.name;
  }
);

const addMember: RequestHandler = updateConvIsAdmin((conv, req) => {
  conv.members = [...conv.members, req.body.member];
});

const addAdmin: RequestHandler = updateConvIsAdmin((conv, req) => {
  conv.admins = [...conv.admins, req.body.admin];
});

export {
  getConversation,
  createConversation,
  prepareToCreate,
  prepareToGetConversations,
  getConversations,
  CollectMebersId,
  deleteConversation,
  updateConversation,
  leaveConversation,
  addMember,
  addAdmin,
};
