import express from 'express';
import cors from 'cors';
import authRoutes from '../src/routes/auth.routes.js';

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/auth', authRoutes);

export default function handler(req, res) {
  app(req, res);
}