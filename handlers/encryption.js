const bcrypt = require('bcrypt');

async function hashPassword(password, saltRounds = 10) {
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
}

async function verifyPassword(inputPassword, hashedPassword) {
  const isMatch = await bcrypt.compare(inputPassword, hashedPassword);
  // boolean true or false
  return isMatch;
}

module.exports = {
  hashPassword,
  verifyPassword,
};
