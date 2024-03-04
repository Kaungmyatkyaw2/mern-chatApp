import express from "express";
import userRouter from "./routes/userRoutes";
import conversationRouter from "./routes/conversationRoutes";
import messageRouter from "./routes/messageRoutes";
import { handleGlobalError } from "./controllers/errorController";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_PRODUCTION_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/users", userRouter);
app.use("/conversations", conversationRouter);
app.use("/messages", messageRouter);

app.use(handleGlobalError);

export default app;
