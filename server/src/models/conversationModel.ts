import mongoose, { Schema } from "mongoose";
import { User } from "./userModel";
import { Message } from "./messageModel";

export interface Conversation extends Document {
  _id: string;
  name: string;
  members: (string | User)[];
  admins: (string | User)[];
  isGroup: boolean;
  createdAt: Date;
  lastMessage?: Message | string;
  lastMsgAt: number;
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
    lastMsgAt: {
      type: Number,
      default: 0,
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

conversationSchema.path("members").validate(function (value) {
  if (value.length < 3 && this.isGroup) {
    return false;
  }
}, "Conversation group must have at least 3 users.");

export const ConversationModel = mongoose.model<Conversation>(
  "conversation",
  conversationSchema
);
