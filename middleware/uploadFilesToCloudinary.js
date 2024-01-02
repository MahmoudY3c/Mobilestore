const { uploadStream } = require('../cloudinary');

const uploadFilesToCloudinary = type => {
  const isSingleFile = type === 'single';

  return async (req, res, next) => {
    if (isSingleFile) {
      const { file } = req;
      const result = await uploadStream(file.buffer);
      req.result = result;
    } else {
      const { files } = req;
      if (files.length > 0) {
        req.result = [];
        for (const file of files) {
          const result = await uploadStream(file.buffer);
          req.result.push(result);
        }
      }
    }

    next();
  };
};

module.exports = uploadFilesToCloudinary;
