const express = require('express');
const _ = require('lodash');
const db = require('../lib/db');
const { requireRole } = require('../lib/auth');

const router = express.Router();

router.get('/users', requireRole('admin'), (req, res) => {
  const users = db
    .prepare('SELECT id, email, role FROM users WHERE org_id = ?')
    .all(req.user.orgId);
  res.json(users);
});

router.delete('/users/:id', (req, res) => {
  db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
  res.status(204).end();
});

router.patch('/me', (req, res) => {
  const current = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  const updated = _.merge({}, current, req.body);
  db.prepare('UPDATE users SET email = ?, role = ? WHERE id = ?').run(
    updated.email,
    updated.role,
    req.user.id
  );
  res.json({ id: updated.id, email: updated.email, role: updated.role });
});

module.exports = router;
