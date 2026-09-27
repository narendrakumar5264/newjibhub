import express from 'express';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import aiRouter from './routes/ai.route.js';
import applicationRouter from './routes/application.route.js';
import interviewRouter from './routes/interview.route.js';
import resumeRouter from './routes/resume.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import connectDB from './config/db.js';
import { errorHandler } from './middlewares/error.middleware.js';

dotenv.config();
connectDB();

const __dirname = path.resolve();
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);
app.use('/api/ai', aiRouter);
app.use('/api/application', applicationRouter);
app.use('/api/interview', interviewRouter);
app.use('/api/resume', resumeRouter);

const distPath = path.join(__dirname, '/client/dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
} else {
  app.get('/', (req, res) => res.json({ message: 'JobHub API is running' }));
}

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));