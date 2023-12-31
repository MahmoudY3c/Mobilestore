
require('dotenv').config();

const {
  DEV_DATABASE_URL, DATABASE_URL, NODE_ENV, PORT,
  CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_URL,
} = process.env;

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
};

module.exports = { ...config };
