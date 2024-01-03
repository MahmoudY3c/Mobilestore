const { uploadStream, getCloudinaryUrl } = require('../cloudinary');

const cloudinaryUploadMiddleware = isSingleFile => async (req, res, next) => {
  if (isSingleFile) {
    const { file } = req;
    console.log(file);
    if (file) {
      const result = await uploadStream(file.buffer);
      result.fileTitle = (file.originalname);
      result.fileUrl = getCloudinaryUrl(result.filename);
      req.result = result;
    }
  } else {
    const { files } = req;
    if (files?.length > 0) {
      req.result = [];
      for (const file of files) {
        console.log(file);
        const result = await uploadStream(file.buffer);
        result.fileTitle = (file.originalname);
        result.fileUrl = getCloudinaryUrl(result.filename);
        req.result.push(result);
      }
    }
  }

  next();
};

const uploadFilesToCloudinary = type => {
  const isSingleFile = type === 'single';
  return cloudinaryUploadMiddleware(isSingleFile);
};

module.exports = uploadFilesToCloudinary;
