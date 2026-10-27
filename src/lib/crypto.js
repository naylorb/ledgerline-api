const crypto = require('crypto');

function hashPassword(password) {
  return crypto.createHash('md5').update(password).digest('hex');
}

function verifyPassword(password, hash) {
  return hashPassword(password) === hash;
}

function cacheKey(payload) {
  return crypto.createHash('md5').update(JSON.stringify(payload)).digest('hex');
}

module.exports = { hashPassword, verifyPassword, cacheKey };
