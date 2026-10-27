const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();
const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads');

router.get('/attachments', (req, res) => {
  const target = path.join(UPLOAD_DIR, req.query.name);
  res.sendFile(target);
});

router.get('/logos/:name', (req, res) => {
  const safeName = path.basename(req.params.name);
  const target = path.join(UPLOAD_DIR, 'logos', safeName);
  if (!fs.existsSync(target)) return res.status(404).end();
  res.sendFile(target);
});

module.exports = router;
