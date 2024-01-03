const { v2: cloudinary } = require('cloudinary');
const { CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, uploads } = require('../config');
const { uniqueId } = require('../handlers');

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

const handlers = {
  default: cloudinary,
  cloudinary,
  uploadStream(buffer, { filename, foldername } = {}) {
    filename = filename || uniqueId();

    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ public_id: `${foldername || 'uploads'}/${filename}` }, (error, result) => {
        if (error) {
          console.log(errors[error.status]);
          reject(error);
        }

        result.filename = filename;
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

          result.filename = filename;
          resolve(result);
        });
    });
  },

  getCloudinaryUrl(filename, foldername) {
    let url = new URL(cloudinary.url(foldername || 'uploads'));
    url = url.protocol === 'http:'
      ? `https://${url.host}${url.pathname}`
      : url.href;

    return `${url}/${filename || ''}`;
  },

  async deleteCloudinayFile(fileToDelete) {
    return new Promise(resolve => {
      cloudinary.uploader.destroy(fileToDelete, (error, result) => {
        resolve({
          url: result.secure_url,
          asset_id: result.asset_id,
          public_id: result.public_id,
        });
      });
    });
  },
  async deleteCloudinayFiles(filesArray) {
    return new Promise(resolve => {
      cloudinary.api.delete_resources(filesArray, (error, result) => {
        resolve(result);
      });
    });
  },
  async moveCloudinayFile(filename) {
    return new Promise(resolve => {
      cloudinary.uploader.rename(`${uploads.temp}/${filename}`, `${uploads.default}/${filename}`, {}, (error, result) => {
        resolve(result);
      });
    });
  },
  async cleanupFiles(obj, propName, nestedFileNameProperty) {
    const files = obj[propName || 'images'];
    const file = obj[propName || 'fileName'];

    if (files?.constructor === Array) {
      const filesArr = files?.map(e => {
        const filename = e[nestedFileNameProperty || 'fileName'];
        return `${uploads.default}/${filename}`;
      });

      console.log(await handlers.deleteCloudinayFiles(filesArr));
    } else if (typeof file === 'string') {
      const filesArr = [`${uploads.default}/${file}`];
      console.log(await handlers.deleteCloudinayFiles(filesArr));
    }
  },
};


module.exports = { ...handlers };
