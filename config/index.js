const path = require('path');
const { milliseconds } = require('../handlers/time');
const fs = require('fs');

require('dotenv').config();

const {
  DEV_DATABASE_URL, DATABASE_URL, NODE_ENV, PORT,
  CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_URL,
} = process.env;

const RSASECRET_PATH = NODE_ENV === 'render'
  ? '/etc/secrets/privateKey.pem'
  : path.join(__dirname, '../keys/pem/privateKey.pem');

const RSAPUBLIC_PATH = NODE_ENV === 'render'
  ? '/etc/secrets/privateKey.pem'
  : path.join(__dirname, '../keys/pem/privateKey.pem');

console.log([NODE_ENV], '.............. NODE_ENV ...............');
console.log(RSASECRET_PATH, RSAPUBLIC_PATH);

const config = {
  APP_NAME: 'mobilestore',
  NODE_ENV: NODE_ENV || 'development',
  PORT: PORT || 3000,
  mongoURI: NODE_ENV === 'production'
    ? DATABASE_URL
    : NODE_ENV === 'development'
      ? DEV_DATABASE_URL
      : DEV_DATABASE_URL,
  CLOUDINARY_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_URL,
  ROLES: ['customer', 'admin'],
  IMAGE_TYPES: ['JPEG', 'PNG', 'WEBP', 'GIF', 'AVIF', 'TIFF'],
  SLIDER: {
    height: 200,
    width: 1080,
    type: ['main', 'branch'],
  },
  SERVICE: {
    type: ['pending', 'active', 'refused', 'done'],
  },
  uploads: {
    default: 'uploads',
    temp: 'temp',
  },
  TokensConfig: {
    refreshMs: milliseconds.days(7), // 30 days
    refresh: '7d',
    expairs: '5h',
  },
  RSASECRET: fs.readFileSync(
    NODE_ENV === 'render'
      ? '/etc/secrets/privateKey.pem'
      : path.jon(__dirname, '../keys/pem/privateKey.pem'),
    'utf-8',
  ),
  RSAPUBLIC: fs.readFileSync(
    NODE_ENV === 'render'
      ? '/etc/secrets/publicKey.pem'
      : path.jon(__dirname, '../keys/pem/publicKey.pem'),
    'utf-8',
  ),
};

module.exports = { ...config };
