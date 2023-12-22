const express = require('express');
const { createSlider, createSliderValidationSchema, sliderUpload } = require('../../controllers/sliders/createSlider');
const sendExpressValidatorErrors = require('../../middleware/sendExpressValidatorErrors');
const { validateParamId } = require('../../middleware/validators/validateParams');
const { sendSliders, validateSlidersTypes } = require('../../controllers/sliders/sendSliders');
const { editSliderValidationSchema, editSlider } = require('../../controllers/sliders/editSlider');
const { deleteSlider } = require('../../controllers/sliders/deleteSlider');
const validateImages = require('../../middleware/validateImages');
// const checkRole = require('../../middleware/jwt/checkRole');
const router = express.Router();

/* GET users listing. */
router.get('/',
  // checkRole('admin'),
  validateSlidersTypes,
  sendExpressValidatorErrors,
  sendSliders,
);

router.put('/:id',
  validateParamId,
  editSliderValidationSchema,
  sendExpressValidatorErrors,
  sliderUpload,
  validateImages(true),
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
  createSlider,
);

module.exports = router;
