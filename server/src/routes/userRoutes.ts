import express from "express";
import * as authController from "../controllers/authController";
import * as userController from "../controllers/userController";

const Router = express.Router();

Router.post("/signup", authController.signup);
Router.post("/login", authController.login);
Router.get("/refresh", authController.refresh);

Router.use(authController.protect);
Router.get("/getMe", userController.setUserId, userController.getUser);

export default Router;
