
const { Router } = require('express');
const infoRouter = Router();
const sendExpressValidatorErrors = require('../../middleware/sendExpressValidatorErrors.js');
const { checkAuth } = require('../../middleware/jwt/checkAuth.js');
const checkRole = require('../../middleware/jwt/checkRole.js');
const { logoUpload, createInfoValidationSchema, createInfo } = require('../../controllers/info/createInfo.js');
const uploadFilesToCloudinary = require('../../middleware/uploadFilesToCloudinary.js');
const { sendAboutUs } = require('../../controllers/info/sendAboutUs.js');
const { sendsocialMedia } = require('../../controllers/info/sendsocialMedia.js');

infoRouter.post(
  '/',
  checkAuth,
  checkRole('admin'),
  logoUpload,
  createInfoValidationSchema,
  sendExpressValidatorErrors,
  uploadFilesToCloudinary('single'),
  createInfo,
);

infoRouter.get(
  '/',
  checkAuth,
  checkRole('admin'),
  sendsocialMedia,
);

infoRouter.get(
  '/social',
  sendsocialMedia,
);

infoRouter.get(
  '/about',
  sendAboutUs,
);

module.exports = infoRouter;

