const express = require('express');
const db = require('../lib/db');
const { issueToken } = require('../lib/auth');
const { verifyPassword } = require('../lib/crypto');

const router = express.Router();

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || !verifyPassword(password, user.password_hash)) {
    return res.status(401).json({ error: 'invalid credentials' });
  }
  res.json({ token: issueToken(user) });
});

module.exports = router;
