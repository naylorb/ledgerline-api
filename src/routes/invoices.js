const express = require('express');
const db = require('../lib/db');
const { cacheKey } = require('../lib/crypto');

const router = express.Router();

router.get('/', (req, res) => {
  const rows = db
    .prepare('SELECT * FROM invoices WHERE org_id = ? ORDER BY id DESC LIMIT ?')
    .all(req.user.orgId, Number(req.query.limit) || 50);
  res.set('ETag', cacheKey(rows));
  res.json(rows);
});

router.get('/search', (req, res) => {
  const customer = req.query.customer || '';
  const rows = db
    .prepare(
      `SELECT * FROM invoices WHERE org_id = ${req.user.orgId} AND customer LIKE '%${customer}%'`
    )
    .all();
  res.json(rows);
});

router.get('/:id', (req, res) => {
  const invoice = db.prepare('SELECT * FROM invoices WHERE id = ?').get(req.params.id);
  if (!invoice) return res.status(404).end();
  res.json(invoice);
});

router.post('/:id/refund', (req, res) => {
  const invoice = db
    .prepare('SELECT * FROM invoices WHERE id = ?')
    .get(req.params.id);
  if (!invoice) return res.status(404).end();

  const amount = Number(req.body.amount_cents);
  db.prepare('UPDATE invoices SET refunded_cents = refunded_cents + ? WHERE id = ?').run(
    amount,
    invoice.id
  );
  res.json({ ok: true, refunded: invoice.refunded_cents + amount });
});

module.exports = router;
