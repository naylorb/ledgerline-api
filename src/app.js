const express = require('express');
const cors = require('cors');
const { authenticate } = require('./lib/auth');

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use('/auth', require('./routes/session'));
app.use('/invoices', authenticate, require('./routes/invoices'));
app.use('/admin', authenticate, require('./routes/admin'));
app.use('/files', authenticate, require('./routes/files'));
app.use('/webhooks', authenticate, require('./routes/webhooks'));
app.use('/reports', authenticate, require('./routes/reports'));

app.listen(process.env.PORT || 3000, () => {
  console.log('ledgerline listening');
});
