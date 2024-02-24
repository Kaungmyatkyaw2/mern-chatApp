import { CookieOptions, RequestHandler, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { UserModel, User } from "../models/userModel";
import * as jwt from "jsonwebtoken";
import AppError from "../utils/appError";

const signJWT = (id: string) =>
  jwt.sign({ id }, process.env.JWT_SECRET || "", {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendJWT = (
  user: User,
  statusCode: number,
  res: Response,
  setRefreshToken?: boolean
) => {
  const token = signJWT(user._id);

  const parsedUser = JSON.parse(JSON.stringify(user));

  parsedUser.password = undefined;

  if (setRefreshToken) {
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET || "",
      { expiresIn: "7d" }
    );

    const cookieConfig: CookieOptions = {
      path: "/",
      domain: "localhost",
      secure: true,
      httpOnly: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    res.cookie("refresh_token", refreshToken, cookieConfig);
  }

  res.status(statusCode).json({
    status: "success",
    token,
    data: user,
  });
};

const signup: RequestHandler = catchAsync(async (req, res, next) => {
  const body = req.body as User;

  const userData = {
    name: body.name,
    email: body.email,
    password: body.password,
    passwordConfirm: body.passwordConfirm,
    picture: body.picture,
  };

  const user = await UserModel.create(userData);

  createSendJWT(user, 201, res, true);
});

const logout: RequestHandler = (req, res, next) => {
  const cookieConfig: CookieOptions = {
    path: "/",
    domain: "localhost",
    secure: true,
    httpOnly: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
  res.clearCookie("refresh_token", cookieConfig);
  res.sendStatus(204);
};

const login: RequestHandler = catchAsync(async (req, res, next) => {
  const { email, password } = req.body as { email: string; password: string };

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 203));
  }

  const user = await UserModel.findOne({ email }).select("+password");
  if (!user) {
    return next(new AppError("Invalid email!", 401));
  }

  const isPasswordCorrect = await user.checkPasswordCorrect(
    password,
    user.password
  );

  if (!isPasswordCorrect) {
    return next(new AppError("Incorrect Password!", 401));
  }

  createSendJWT(user, 200, res, true);
});

const refresh: RequestHandler = catchAsync(async (req, res, next) => {
  const cookies = req.cookies;

  const refreshToken = cookies.refresh_token;

  if (!refreshToken) {
    return next(new AppError("You aren't logged in.", 401));
  }

  const jwtVerifyCallback: jwt.VerifyCallback = async (error, decoded) => {
    if (error) {
      return next(new AppError("Invalid Refresh Token!", 401));
    }

    const user = await UserModel.findById((decoded as jwt.JwtPayload)?.id);
    if (!user) {
      return next(
        new AppError("The user belonging to this id is no longer exist.", 401)
      );
    }

    const isPasswordChange = user.checkPasswordChanged(
      (decoded as jwt.JwtPayload).iat || 0
    );

    if (isPasswordChange) {
      return next(
        new AppError(
          "The user have changed his password. Please login again.",
          401
        )
      );
    }

    createSendJWT(user, 200, res, true);
  };

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET || "",
    jwtVerifyCallback
  );
});

const protect: RequestHandler = catchAsync(async (req, res, next) => {
  let token;

  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer ")
  ) {
    return next(new AppError("You aren't logged in.", 401));
  }

  token = req.headers.authorization.split(" ")[1].trim();

  const decodedJWT = jwt.verify(
    token,
    process.env.JWT_SECRET || ""
  ) as jwt.JwtPayload;
  const user = await UserModel.findById(decodedJWT.id);

  if (!user) {
    return next(
      new AppError("The user belonging to this token is no longer exist.", 401)
    );
  }

  const isPasswordChange = user.checkPasswordChanged(decodedJWT.iat || 0);

  if (isPasswordChange) {
    return next(
      new AppError(
        "The user have changed his password. Please login again.",
        401
      )
    );
  }

  req.user = user;
  next();
});

export { signup, login, protect, refresh,logout };
