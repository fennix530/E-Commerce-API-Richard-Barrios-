import express from 'express';
import { loginUser } from '../controllers/auth.controller.js';


const router = express.Router();

router.post('/login', loginUser);

router.get('/test', (req, res) => {
  res.send('auth.routes.js cargado correctamente');
});

export default router;