const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Token não fornecido.' });

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ message: 'Token não fornecido.' });

    const token = parts[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') return res.status(401).json({ message: 'Acesso negado. Token expirado.' });
        return res.status(401).json({ message: 'Token inválido.' });
      }
      req.user = decoded;
      next();
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erro no servidor.' });
  }
};
