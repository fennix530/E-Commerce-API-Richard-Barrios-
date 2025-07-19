import express from 'express';
import cors from 'cors';
import productRoutes from '../src/routes/productRoutes.js';

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/productos', productRoutes);

export default function handler(req, res) {
  app(req, res);
}