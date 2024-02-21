import express from "express";
import * as authController from "../controllers/authController";
import * as messageController from "../controllers/messageController";

const Router = express.Router({ mergeParams: true });

Router.use(authController.protect);
Router.route("/")
  .get(messageController.prepareToGetMessages, messageController.getMessages)
  .post(messageController.prepareToCreate, messageController.createMessage);

export default Router;
