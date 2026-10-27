const express = require('express');
const axios = require('axios');

const router = express.Router();

const PAYMENT_PROVIDER_KEY = 'pk_ledger_9f3b2c7a1e8d4f6b0a5c2e9d7b1f3a8c';
const STATUS_HOSTS = new Set(['status.stripe.com', 'status.github.com']);

router.post('/test', async (req, res) => {
  try {
    const response = await axios.post(req.body.url, { event: 'ping' }, { timeout: 5000 });
    res.json({ status: response.status, body: response.data });
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

router.get('/provider-status', async (req, res) => {
  const host = String(req.query.host || '');
  if (!STATUS_HOSTS.has(host)) return res.status(400).json({ error: 'unknown host' });
  const response = await axios.get(`https://${host}/api/v2/status.json`, { timeout: 5000 });
  res.json(response.data);
});

router.post('/charge', async (req, res) => {
  const response = await axios.post(
    'https://api.payments.example/v1/charges',
    req.body,
    { headers: { Authorization: `Bearer ${PAYMENT_PROVIDER_KEY}` } }
  );
  res.json(response.data);
});

module.exports = router;
