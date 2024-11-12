// /app.js

import express from 'express';
// import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());


// Route middlewares
app.use('/api/auth', authRoutes);
app.use('/api', postRoutes);

export default app;
