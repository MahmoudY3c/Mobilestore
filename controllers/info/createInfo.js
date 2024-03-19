const { checkSchema } = require('express-validator');
const { asyncHandler } = require('../../handlers/error');
const { extractRequiredFields, validateUrl } = require('../../handlers');
const SiteInfo = require('../../db/models/SiteInfo');
const multer = require('multer');
const validator = require('validator');

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
  social: {
    optional: true,
    custom: {
      options(value, { req }) {
        // allowing to send it as a json string when sending data as form data or as an array when sending it as a json
        value = typeof value === 'string' ? JSON.parse(value) : value;

        // check if all values is string
        if (!value?.length) {
          throw new Error(req.t('INVALID_DATATYPE', { field: 'social', type: 'Array' }))
        }

        value.forEach((v, index) => {
          // validate value is object
          if (v.constructor !== Object) {
            throw new Error(req.t('INVALID_DATATYPE', { field: 'social data', type: 'Object' }));
          }

          const keys = Object.keys(v);

          // check if keys is equal to 3 => icon, name, url
          if (keys.length !== 3) {
            throw new Error(req.t('NOT_EQUAL', { field: 'social objects', length: '3' }));
          }

          // validate url 
          if (!validateUrl(v.url)) {
            throw new Error(req.t('INVALID_MSG', { field: v.url }))
          }

          // validate values is string
          keys.forEach(k => {
            if (typeof v[k] !== 'string') {
              throw new Error(req.t('INVALID_DATATYPE', { field: 'social data values', type: 'String' }));
            }

            // escape characters
            // if (k === 'icon' || k === 'name') {
            //   req.body.social[index][k] = validator.escape(req.body.social[index][k]);
            // }
          })
        });

        return true;
      },
    },
  },
});

const createInfoPayload = infoPayload(false);
const createInfoValidationSchema = checkSchema(createInfoPayload);

const upload = multer();
const logoUpload = upload.single('logo');

const createInfo = asyncHandler(async (req, res) => {
  const infoPayload = extractRequiredFields(Object.keys(createInfoPayload), req.body);
  console.log(infoPayload)
  const { result } = req;
  if (result) {
    infoPayload.logo = {
      image: result.fileUrl,
      fileTitle: result.fileTitle,
      fileName: result.filename,
    };
  }

  if (infoPayload.social) {
    // allowing to send it as a json string when sending data as form data or as an array when sending it as a json
    infoPayload.social = typeof infoPayload.social === 'string' ? JSON.parse(infoPayload.social) : infoPayload.social;
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
