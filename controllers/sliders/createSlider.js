const { checkSchema } = require('express-validator');
const { asyncHandler } = require('../../handlers/error');
const { resizeSliderImage } = require('../../handlers');
const { SLIDER: SLIDER_SIZE } = require('../../config');
const Sliders = require('../../db/models/Sliders');
const multer = require('multer');
const upload = multer();

// const sliderUpload = upload.fields([
//   { name: 'image', maxCount: 1 },
// ]);

const sliderUpload = upload.single('image');

const slidersPayload = isOptional => ({
  title: {
    trim: true,
    notEmpty: true,
    optional: Boolean(isOptional),
  },
  type: {
    trim: true,
    notEmpty: true,
    optional: Boolean(isOptional),
    isIn: {
      options: [SLIDER_SIZE.type],
      errorMessage: (value, { req }) => req.t('INVALID_VALUE', { value }),
    },
  },
  file: {
    optional: Boolean(isOptional),
    custom: {
      options(value, { req }) {
        console.log(req?.file);
        if (!(req?.file?.buffer instanceof Buffer)) {
          throw new Error(req.t('INVALID_MSG', { field: 'image' }));
        }

        return true;
      },
    },
  },
});

const createSliderPayload = slidersPayload(false);
const createSliderValidationSchema = checkSchema(createSliderPayload);

const createSlider = asyncHandler(async (req, res) => {
  const { file } = req;
  const { title, type } = req.body;
  const sliderPayload = { title, type };
  sliderPayload.image = await resizeSliderImage(file.buffer, {
    height: SLIDER_SIZE.height,
    width: SLIDER_SIZE.width,
  });

  const slider = new Sliders(sliderPayload);
  await slider.save();
  res.status(201).json(slider);
});

module.exports = { createSlider, sliderUpload, createSliderValidationSchema, slidersPayload };
