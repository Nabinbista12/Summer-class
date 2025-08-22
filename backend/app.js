import dotenv from "dotenv";
dotenv.config();
// import { configDotenv } from "dotenv";

import express from "express";
import cors from "cors";
import { API_BASE } from "./config/URLAPI.js";

import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";

const app = express();

app.use(
  cors({
    origin: API_BASE,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

export default app;
