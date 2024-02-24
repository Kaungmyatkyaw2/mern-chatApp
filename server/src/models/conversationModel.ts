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
        type: mongoose.Schema.ObjectId,
        ref: "user",
      },
    ],
    admins: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "user",
      },
    ],
    lastMessage: {
      type: mongoose.Schema.ObjectId,
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

conversationSchema.path("members").validate(function (value) {
  if (!value.length) {
    return true;
  }
  const uniqueLabels = new Set(value.map((label: any) => label.toString()));
  return uniqueLabels.size === value.length;
}, "Duplicate user in a same conversation.");

conversationSchema.path("members").validate(function (value) {
  if (value.length == 1) {
    return false;
  }
}, "Conversation can't be create with only one user.");

export const ConversationModel = mongoose.model<Conversation>(
  "conversation",
  conversationSchema
);
