import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { app } from './utils/socket.js';




app.use(cors({
    origin: "https://codehub-eosin.vercel.app",
    credentials: true
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser()); //It adds middleware to your Express app that parses cookies from the incoming request and makes them easily accessible.
import { authRouter } from './routes/auth.routes.js';
import mssgRouter from './routes/message.routes.js';
import codeRouter from './routes/codesession.routes.js';

app.use("/api/auth",authRouter);
app.use("/api/message",mssgRouter);
app.use("/api/code",codeRouter);

export default app; 