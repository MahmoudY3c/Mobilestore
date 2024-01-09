const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { RSASECRET, RSAPUBLIC } = require('../config');

async function hashPassword(password, saltRounds = 10) {
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
}

async function verifyPassword(inputPassword, hashedPassword) {
  const isMatch = await bcrypt.compare(inputPassword, hashedPassword);
  // boolean true or false
  return isMatch;
}

function encrypt(data, key = RSASECRET, keyType = 'private', enc = 'Encrypt') {
  const arrayBuffer = Buffer.from(data, 'utf-8');
  // method is like cryptso.publicEncrypt(key, arrayBuffer)
  const encrypt = crypto[`${keyType}${enc}`](key, arrayBuffer);
  return encrypt.toString('base64');
}

function decrypt(data, key = RSAPUBLIC, keyType = 'public') {
  // console.log(key, keyType, 'Decrypt')
  return encrypt(key, data, keyType, 'Decrypt');
}

function hash(data, digest = 'hex', algo = 'sha256') {
  const hash = crypto.createHash(algo);
  hash.update(data);
  const _hash = hash.digest(digest);
  return { hash: _hash, algo, digest };
}

function generateHashToken(data, key = RSASECRET, keyType = 'private', enc = 'Encrypt') {
  // first step encrypt the data
  const encrypted = encrypt(data, key, keyType, enc);

  // one more step create a hash of the encrypted data
  const hashed = hash(encrypted);

  return hashed;
}

// eslint-disable-next-line max-params
function verifyHashToken(dataHash, data, key = RSASECRET, keyType = 'private', enc = 'Encrypt') {
  // first step encrypt the data
  const encrypted = encrypt(data, key, keyType, enc);

  // create a hash from the encrypted data
  const { hash: verifyHash } = hash(encrypted);

  // check if the hash is match
  return verifyHash === dataHash;
}

module.exports = {
  hashPassword,
  verifyPassword,
  generateHashToken,
  verifyHashToken,
  decrypt,
};
