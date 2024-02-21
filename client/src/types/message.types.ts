import { Conversation } from "./conversations.types";
import { User } from "./user.types";

export interface Message {
  _id: string;
  conversation: Conversation | string;
  sender: User;
  createdAt: Date;
  text: string;
}
