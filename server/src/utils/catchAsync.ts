import { RequestHandler } from "express";

export const catchAsync: (fn: RequestHandler) => RequestHandler = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
