import express from "express";
import * as authController from "../controllers/authController";
import * as userController from "../controllers/userController";

const Router = express.Router();

Router.post("/signup", authController.signup);
Router.post("/login", authController.login);
Router.post("/google", authController.googleLogin);
Router.post("/logout", authController.logout);
Router.get("/refresh", authController.refresh);

Router.use(authController.protect);
Router.route("/").get(userController.getUsers);
Router.route("/me")
  .get(userController.setUserId, userController.getUser)
  .patch(userController.updateMe);
Router.patch("/updateMyPassword", authController.updatePassword);
Router.get("/search", userController.getUsersBySearching);

export default Router;
