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
  cors: {
    origin: [process.env.CLIENT_PRODUCTION_URL || "http://localhost:5173"],
  },
});

io.on("connection", (socket) => {
  socket.on("connected", async (data) => {
    const { userId } = data;

    socket.join(userId);
  });

  socket.on("sendMessage", (data: Message) => {
    if (typeof data.conversation !== "string") {
      data.conversation.members.forEach((el) => {
        io.to("" + el).emit("receiveMessage", data);
      });
    }
  });

  socket.on("createConversation", (data: Conversation) => {
    data.members.forEach((el) => {
      const isString = typeof el == "string";
      io.to(isString ? el : el._id).emit("receiveNewConversation", data);
    });
  });

  socket.on("deleteConversation", (data: Conversation) => {
    data.members.forEach((el) => {
      const isString = typeof el == "string";
      io.to(isString ? el : el._id).emit("receiveDeleteConversation", data);
    });
  });

  socket.on("leaveConversation", (data: Conversation) => {
    data.members.forEach((el) => {
      const isString = typeof el == "string";
      io.to(isString ? el : el._id).emit("receiveUpdatedConversation", data);
    });
  });
});
