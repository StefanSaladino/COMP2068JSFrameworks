//code copied from stack overflow so user id is not in plain text
require('dotenv').config();
const crypto = require('crypto');

const algorithm = process.env.ALGORITHM;
const key = Buffer.from(process.env.ALGORITHM_KEY, 'hex'); // Use a consistent key from environment variable

// Encrypt function
function encrypt(text) {
  const iv = crypto.randomBytes(16); // Generate a new IV for each encryption
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

// Decrypt function
function decrypt(text) {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

module.exports = { encrypt, decrypt };
