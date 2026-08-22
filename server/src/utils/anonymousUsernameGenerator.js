const crypto = require('crypto');

/**
 * Generates a stable, deterministic anonymous handle based on User ID
 * @param {string|ObjectId} userId 
 * @returns {string}
 */
const generateAnonymousUsername = (userId) => {
  if (!userId) return 'Anonymous User #0000';
  const idStr = userId.toString();
  const hash = crypto.createHash('sha256').update(idStr).digest('hex');
  const code = hash.substring(0, 4).toUpperCase();
  return `Anonymous User #${code}`;
};

module.exports = generateAnonymousUsername;
