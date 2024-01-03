
const createHttpError = require('http-errors');
const { asyncHandler } = require('../../handlers/error');
const { uploadStream, getCloudinaryUrl } = require('../../cloudinary');
const multer = require('multer');
const { checkSchema } = require('express-validator');
const { cloudinary } = require('../../cloudinary');

const uploadsPayload = isOptional => ({
  files: {
    optional: Boolean(isOptional),
    custom: {
      options(value, { req }) {
        console.log(req?.files);
        const isAllNotBuffer = req?.files?.every(e => e?.buffer instanceof Buffer);

        if (!isAllNotBuffer) {
          throw new Error(req.t('INVALID_MSG', { field: 'images' }));
        }

        return true;
      },
    },
  },
});

const upload = multer();
const uploadsUploader = upload.array('images');

const createUploadsPayload = uploadsPayload(false);
const createUploadsValidationSchema = checkSchema(createUploadsPayload);

const moveUploadedFileFromTempToUploads = propertyName => async (req, res, next) => {
  const files = req[propertyName || 'files'];
  req.result = [];

  for (const file of files) {
    const result = await cloudinary.uploader.rename(`temp/${file.filename}`, `uploads/${file.filename}`);

    req.result.push({
      ...file,
      image: getCloudinaryUrl(file.filename),
      fileId: result.public_id,
      filename: file.filename,
    });
  }


  // req.result = files;
  next();
};

const uploadTempFilesToCloudinary = asyncHandler(async (req, res, next) => {
  try {
    const { files } = req;
    const results = [];
    if (files.length > 0) {
      for (const file of files) {
        const result = await uploadStream(file.buffer, { foldername: 'temp' });
        console.log(result);
        results.push({
          image: getCloudinaryUrl(result.filename, 'temp'),
          fileTitle: file.originalname,
          fileName: file.originalname,
          fileId: result.public_id,
        });
      }
    }

    res.status(200).json(results);
  } catch (e) {
    console.log(e.message);
    return next(createHttpError(404));
  }
});

module.exports = { uploadTempFilesToCloudinary, createUploadsValidationSchema, moveUploadedFileFromTempToUploads, uploadsUploader };
