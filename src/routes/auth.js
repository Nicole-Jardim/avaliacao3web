const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const users = require('../data/users');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    console.log('POST /register body:', req.body);
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Username e password são obrigatórios.' });

    const exists = users.find((u) => u.username === username);
    if (exists) return res.status(409).json({ message: 'Username já existe.' });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = { username, password: hashed };
    users.push(user);
    return res.status(201).json({ message: 'Usuário registrado com sucesso.' });
  } catch (error) {
    return res.status(500).json({ message: 'Erro no servidor.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    console.log('POST /login body:', req.body);
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Username e password são obrigatórios.' });

    const user = users.find((u) => u.username === username);
    if (!user) return res.status(401).json({ message: 'Credenciais inválidas.' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Credenciais inválidas.' });

    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h', algorithm: 'HS256' });
    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ message: 'Erro no servidor.' });
  }
});

module.exports = router;
