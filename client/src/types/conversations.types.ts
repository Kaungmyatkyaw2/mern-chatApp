import { Message } from "./message.types";
import { User } from "./user.types";

export interface Conversation {
  _id: string;
  name: string;
  members: User[];
  admins: string[];
  isGroup: boolean;
  createdAt: Date;
  lastMsgAt? : number;
  lastMessage?: Message;
}
