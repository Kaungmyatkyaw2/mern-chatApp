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
        path: "/",
        domain: "chattyv1.vercel.app",
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      };

export default cookieConfig;
