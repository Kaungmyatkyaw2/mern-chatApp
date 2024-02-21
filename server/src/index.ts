import * as dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import mongoose from "mongoose";
import app from "./app";
import { Server } from "socket.io";
import { Conversation, ConversationModel } from "./models/conversationModel";
import { Message } from "./models/messageModel";
const PORT = process.env.PORT || 3000;

const DB_URL = process.env.DB_URL || "";

mongoose.connect(DB_URL).then((res) => {
  console.log("Database is connected...");
});

const expressServer = app.listen(PORT, () => {
  console.log("Server is running on PORT : ", PORT);
});

const io = new Server(expressServer, {
  cors: { origin: ["http://localhost:5173"] },
});

io.on("connection", (socket) => {
  let conversations: string[] = [];

  socket.on("connected", async (data) => {
    const { userId } = data;
    conversations = (await ConversationModel.find({ members: userId })).map(
      (el) => "" + el._id
    );

    conversations.forEach((roomId) => {
      socket.join("" + roomId);
    });

    conversations.forEach((roomId) => {
      io.to(roomId).emit("userActive", { userId: userId });
    });
  });

  socket.on("sendMessage", (data) => {
    const roomId = "" + data.conversation;
    io.to("" + roomId).emit("receiveMessage", data);
  });
});
