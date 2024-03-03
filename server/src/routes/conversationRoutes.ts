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
Router.route("/:id")
  .get(conversationController.getConversation)
  .delete(conversationController.deleteConversation);

Router.route("/:id/members")
  .post(conversationController.addMember)
  .delete(conversationController.leaveConversation);

Router.route("/:id/admins")
  .post(conversationController.addAdmin)
  .delete(conversationController.leaveConversation);

Router.use("/:conversation/messages", messageRouter);

export default Router;
