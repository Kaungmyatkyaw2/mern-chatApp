import express from "express";
import * as authController from "../controllers/authController";
import * as conversationController from "../controllers/conversationController";
import * as messageController from "../controllers/messageController";

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
Router.route("/:conversation/messages").get(messageController.getMessages);

export default Router;
