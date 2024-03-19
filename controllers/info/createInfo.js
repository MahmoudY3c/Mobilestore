const { checkSchema } = require('express-validator');
const { asyncHandler } = require('../../handlers/error');
const { extractRequiredFields, validateUrl } = require('../../handlers');
const SiteInfo = require('../../db/models/SiteInfo');
const multer = require('multer');

const infoPayload = isOptional => ({
  logo: {
    optional: true,
    custom: {
      options(value, { req }) {
        // console.log(req?.files);
        const isNotBuffer = req?.file.buffer instanceof Buffer;

        if (!isNotBuffer) {
          throw new Error(req.t('INVALID_MSG', { field: 'images' }));
        }

        return true;
      },
    },
  },

  name: {
    isString: true,
    optional: true,
    trim: true,
    escape: true,
    errorMessage: (value, { req }) => req.t('INVALID_DATATYPE', { field: 'name', type: 'string' }),
  },
  description: {
    isString: true,
    optional: true,
    trim: true,
    escape: true,
    errorMessage: (value, { req }) => req.t('INVALID_DATATYPE', { field: 'description', type: 'string' }),
  },
  facebook: {
    isString: true,
    optional: true,
    trim: true,
    custom: {
      options(value, { req }) {
        if (!validateUrl(value)) {
          throw new Error(req.t('INVALID_MSG', { field: value }))
        }

        return true;
      },
    },
    errorMessage: (value, { req }) => req.t('INVALID_DATATYPE', { field: 'facebook', type: 'string' }),
  },
  twitter: {
    isString: true,
    optional: true,
    trim: true,
    custom: {
      options(value, { req }) {
        if (!validateUrl(value)) {
          throw new Error(req.t('INVALID_MSG', { field: value }))
        }

        return true;
      },
    },
    errorMessage: (value, { req }) => req.t('INVALID_DATATYPE', { field: 'twitter', type: 'string' }),
  },
  tiktok: {
    isString: true,
    optional: true,
    trim: true,
    custom: {
      options(value, { req }) {
        if (!validateUrl(value)) {
          throw new Error(req.t('INVALID_MSG', { field: value }))
        }

        return true;
      },
    },
    errorMessage: (value, { req }) => req.t('INVALID_DATATYPE', { field: 'tiktok', type: 'string' }),
  },
  telegram: {
    isString: true,
    optional: true,
    trim: true,
    custom: {
      options(value, { req }) {
        if (!validateUrl(value)) {
          throw new Error(req.t('INVALID_MSG', { field: value }))
        }

        return true;
      },
    },
    errorMessage: (value, { req }) => req.t('INVALID_DATATYPE', { field: 'telegram', type: 'string' }),
  },
  whatsapp: {
    isString: true,
    optional: true,
    trim: true,
    custom: {
      options(value, { req }) {
        if (!validateUrl(value)) {
          throw new Error(req.t('INVALID_MSG', { field: value }))
        }

        return true;
      },
    },
    errorMessage: (value, { req }) => req.t('INVALID_DATATYPE', { field: 'whatsapp', type: 'string' }),
  },
  phoneNumber: {
    optional: true,
    isMobilePhone: true,
    trim: true,
    errorMessage: (value, { req }) => req.t('INVALID_PHONE_NUMBER'),
  },
});

const createInfoPayload = infoPayload(false);
const createInfoValidationSchema = checkSchema(createInfoPayload);

const upload = multer();
const logoUpload = upload.single('logo');

const createInfo = asyncHandler(async (req, res) => {
  const infoPayload = extractRequiredFields(Object.keys(createInfoPayload), req.body);
  const { result } = req;
  if (result) {
    infoPayload.logo = {
      image: result.fileUrl,
      fileTitle: result.fileTitle,
      fileName: result.filename,
    };
  }

  const isExists = await SiteInfo.findOne({});

  if (isExists) {
    // update the data 
    const updatedData = await SiteInfo.findByIdAndUpdate(isExists._id, infoPayload, { new: true });
    return res.status(201).json(updatedData);
  }

  // create a new info data
  const infoData = await SiteInfo.create(infoPayload);
  res.status(201).json(infoData);
});

module.exports = { createInfo, logoUpload, createInfoValidationSchema, infoPayload };
