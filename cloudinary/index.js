const { v2: cloudinary } = require('cloudinary');
const { CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = require('../config');

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const errors = {
  200: 'OK. Successful.',
  400: 'Bad request. Invalid request parameters.',
  401: 'Authorization required.',
  403: 'Not allowed.',
  404: 'Not found.',
  420: 'Rate limited.',
  500: 'Internal error. Contact support.',
};


module.exports = {
  cloudinary,
  uploadStream(buffer, filename) {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ public_id: `uploads/${filename}` }, (error, result) => {
        if (error) {
          reject(error);
          console.log(errors[error.status]);
        }

        resolve(result);
      }).end(buffer);
    });
  },
  uploader(imagePath, filename) {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(imagePath,
        { public_id: filename },
        (error, result) => {
          if (error) {
            reject(error);
            console.log(errors[error.status]);
          }

          resolve(result);
        });
    });
  },
};
