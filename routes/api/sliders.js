const express = require('express');
const { createSlider, createSliderValidationSchema, sliderUpload } = require('../../controllers/sliders/createSlider');
const sendExpressValidatorErrors = require('../../middleware/sendExpressValidatorErrors');
const { validateParamId } = require('../../middleware/validators/validateParams');
const { sendSliders, validateSlidersTypes } = require('../../controllers/sliders/sendSliders');
const { editSliderValidationSchema, editSlider } = require('../../controllers/sliders/editSlider');
const { deleteSlider } = require('../../controllers/sliders/deleteSlider');
const validateImages = require('../../middleware/validateImages');
const { sendSliderById } = require('../../controllers/sliders/sendSliderById');
const uploadFilesToCloudinary = require('../../middleware/uploadFilesToCloudinary');
const resizeSliderImageAsBuffer = require('../../middleware/resizeSliderImageAsBuffer');
// const checkRole = require('../../middleware/jwt/checkRole');
const router = express.Router();

/* GET users listing. */
router.get('/',
  // checkRole('admin'),
  validateSlidersTypes,
  sendExpressValidatorErrors,
  sendSliders,
);


/* GET users listing. */
router.get('/:id',
  // checkRole('admin'),
  validateParamId,
  sendExpressValidatorErrors,
  sendSliderById,
);

router.put('/:id',
  sliderUpload,
  validateImages(true),
  validateParamId,
  editSliderValidationSchema,
  sendExpressValidatorErrors,
  resizeSliderImageAsBuffer('single'),
  uploadFilesToCloudinary('single'),
  editSlider,
);


router.delete('/:id',
  // checkRole('admin'),
  validateParamId,
  sendExpressValidatorErrors,
  deleteSlider,
);

router.post('/',
  // checkRole('admin'),
  sliderUpload,
  validateImages(),
  createSliderValidationSchema,
  sendExpressValidatorErrors,
  resizeSliderImageAsBuffer('single'),
  uploadFilesToCloudinary('single'),
  createSlider,
);

module.exports = router;
