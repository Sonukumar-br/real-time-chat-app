import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/db.js";
import userRouter from "./routes/user.routes.js";
import {app, server} from "./socket/socket.js";
// ✅ SAME NAME AS FILE
import authRouter from "./routes/auth.routes.js";
import messageRouter from "./routes/message.routes.js";

dotenv.config();


const port = process.env.PORT || 8000;

app.set("trust proxy", 1);

app.use(cors({
  origin: ["http://localhost:5174","http://localhost:5173"],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/message", messageRouter);

server.listen(port, async () => {
  await connectDB();
  console.log("Server started on port", port);
});

