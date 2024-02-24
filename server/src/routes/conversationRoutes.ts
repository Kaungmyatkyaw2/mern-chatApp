import express from "express";
import * as authController from "../controllers/authController";
import * as conversationController from "../controllers/conversationController";
import messageRouter from "../routes/messageRoutes";

const Router = express.Router();

Router.use(authController.protect);
Router.route("/")
  .get(
    conversationController.prepareToGetConversations,
    conversationController.getConversations
  )
  .post(
    conversationController.prepareToCreate,
    conversationController.CollectMebersId,
    conversationController.createConversation
  );
Router.route("/:id").get(conversationController.getConversation);
Router.use("/:conversation/messages", messageRouter);

export default Router;
