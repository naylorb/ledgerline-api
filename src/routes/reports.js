const express = require('express');
const { exec } = require('child_process');

const router = express.Router();

router.get('/export', (req, res) => {
  const month = req.query.month;
  exec(`python3 py/export.py --month ${month}`, (err, stdout) => {
    if (err) return res.status(500).json({ error: 'export failed' });
    res.type('text/csv').send(stdout);
  });
});

router.get('/preview', (req, res) => {
  const title = req.query.title || 'Monthly report';
  res.send(`<html><body><h1>${title}</h1><p>Preview generated.</p></body></html>`);
});

module.exports = router;
