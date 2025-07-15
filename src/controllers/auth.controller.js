const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const userMock = {
  id: 1,
  username: 'prueba',
  password: bcrypt.hashSync(process.env.MOCK_USER_PASSWORD, 10),
};

exports.loginUser = (req, res) => {
  const { username, password } = req.body;

  if (username !== userMock.username) {
    return res.status(400).json({ message: 'Usuario incorrecto' });
  }

  const validPassword = bcrypt.compareSync(password, userMock.password);
  if (!validPassword) {
    return res.status(400).json({ message: 'Contraseña incorrecta' });
  }

  const token = jwt.sign({ id: userMock.id }, process.env.JWT_SECRET, { expiresIn: '4h' });

  res.json({ token });
};