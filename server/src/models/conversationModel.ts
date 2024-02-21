import mongoose, { Schema } from "mongoose";
import { User } from "./userModel";
import { Message } from "./messageModel";

export interface Conversation extends Document {
  _id: string;
  name: string;
  members: Array<String> | Array<User>;
  admins: Array<String> | Array<User>;
  isGroup: boolean;
  createdAt: Date;
  lastMessage?: Message | string;
}

const conversationSchema = new Schema<Conversation>(
  {
    name: {
      type: String,
      required: [true, "Name is required for an conversation."],
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    admins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "message",
    },
    isGroup: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const ConversationModel = mongoose.model<Conversation>(
  "conversation",
  conversationSchema
);
