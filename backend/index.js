import express from 'express';

import dotenv from 'dotenv';
dotenv.config();

import connectDb from './config/db.js';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes.js';
import cors from 'cors';
import userRouter from './routes/user.routes.js';
import shopRouter from './routes/shop.routes.js';
import itemRouter from './routes/item.routes.js';
import orderRouter from './routes/order.routes.js';
import nodemailer from 'nodemailer';
import http from 'http';
import { Server } from 'socket.io';
import { socketHandler } from './socket.js';

const app = express();
const server = http.createServer(app);

export const transporter = nodemailer.createTransport({
  service: 'Gmail',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

const io = new Server(server, {
  cors: {
    origin: 'https://dinedash-iee1.onrender.com',
    // origin: 'http://localhost:5173',
    credentials: true,
    methods: ['POST', 'GET'],
  },
});

app.set('io', io);

const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: 'https://dinedash-iee1.onrender.com',
    // origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/shop', shopRouter);
app.use('/api/item', itemRouter);
app.use('/api/order', orderRouter);

socketHandler(io);
server.listen(port, () => {
  connectDb();
  console.log(`*****Server started at ${port}*****`);
});
