import mongoose, { Schema } from "mongoose";
import { User } from "./userModel";
import { Conversation } from "./conversationModel";

export interface Message extends Document {
  _id: string;
  conversation: Conversation | string;
  sender: User | string;
  createdAt: Date;
  text: string;
  isDeleted?: boolean;
}

const MessageSchema = new Schema<Message>(
  {
    conversation: {
      type: mongoose.Schema.ObjectId,
      required: [true, "Conversation is required to an message"],
      ref: "conversation",
    },
    sender: {
      type: mongoose.Schema.ObjectId,
      required: [true, "User is required to an message"],
      ref: "user",
    },
    text: {
      type: String,
      required: [true, "Text is required to an message"],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const MessageModel = mongoose.model<Message>("message", MessageSchema);
