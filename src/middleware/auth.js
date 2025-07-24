import jwt from 'jsonwebtoken';

// Token
const authMiddleware = (req, res, next) => {
  const bearerToken = req.header('Authorization');
  const token = bearerToken && bearerToken.startsWith('Bearer ')
    ? bearerToken.split(' ')[1]
    : bearerToken;

  if (!token) {
    console.warn('Token no proporcionado en la solicitud');
    return res.status(401).json({ message: 'Acceso denegado. No se proporcionó token.' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    console.error('Error al verificar token:', err.message);
    res.status(400).json({ message: 'Token inválido o expirado.' });
  }
};

export default authMiddleware;