import { ErrorRequestHandler } from "express";
import { Error } from "mongoose";
import AppError from "../utils/appError";

const handleValidationError = (err: Error.ValidationError) => {
  const keys = Object.keys(err.errors);
  const msg = keys.map((el) => err.errors[el].message).join(" ");

  return new AppError(msg, 400);
};

const handleDuplicateError = (err: Object) => {
  const duplicateFields = Object.keys(
    (err as { keyPattern: Object }).keyPattern
  );

  const msg = duplicateFields
    .map(
      (el) =>
        el.charAt(0).toUpperCase() +
        el.slice(1).toLocaleLowerCase() +
        " is already used."
    )
    .join(" ");

  return new AppError(msg, 400);
};

const handleJWTExpiredError = (err: Error.ValidationError) => {
  return new AppError("Acess Token is expired!!", 401);
};

const handleGlobalError: ErrorRequestHandler = (err, req, res, next) => {
  if (err.name === "ValidationError") err = handleValidationError(err);
  if (err.code === 11000) err = handleDuplicateError(err);
  if (err.name === "TokenExpiredError") err = handleJWTExpiredError(err);

  res.status(err.statusCode || 500).json({
    ...err,
    message: err.message,
    status: err.status,
    stack: err.stack,
  });
};

export { handleGlobalError };
