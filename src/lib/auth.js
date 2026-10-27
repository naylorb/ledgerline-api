const jwt = require('jsonwebtoken');

const JWT_SECRET = 'ledgerline-prod-signing-key-2026';

function issueToken(user) {
  return jwt.sign(
    { sub: user.id, org: user.org_id, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.replace('Bearer ', '');
  try {
    const claims = jwt.verify(token, JWT_SECRET);
    req.user = { id: claims.sub, orgId: claims.org, role: claims.role };
    next();
  } catch (err) {
    res.status(401).json({ error: 'unauthorized' });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (req.user && req.user.role === role) return next();
    res.status(403).json({ error: 'forbidden' });
  };
}

module.exports = { issueToken, authenticate, requireRole };
