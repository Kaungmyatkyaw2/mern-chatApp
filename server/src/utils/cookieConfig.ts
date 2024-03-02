import { CookieOptions } from "express";

const cookieConfig: CookieOptions =
  process.env.ENV == "development"
    ? {
        path: "/",
        domain: "localhost",
        secure: true,
        httpOnly: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      }
    : {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "none",
        secure: true,
      };

export default cookieConfig;
