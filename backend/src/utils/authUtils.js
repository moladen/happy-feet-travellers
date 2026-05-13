const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const env = require('@/config/env');

function generateToken(payload, expiresIn = env.jwt.expiresIn) {
  return jwt.sign(payload, env.jwt.secret, { expiresIn });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, env.jwt.secret);
  } catch {
    return null;
  }
}

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

function comparePassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

module.exports = {
  generateToken,
  verifyToken,
  hashPassword,
  comparePassword,
};
