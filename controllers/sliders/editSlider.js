const { asyncHandler } = require('../../handlers/error');
const Sliders = require('../../db/models/Sliders');
const { checkSchema } = require('express-validator');
const { slidersPayload } = require('./createSlider');
const { extractRequiredFields, resizeSliderImage, deleteFile } = require('../../handlers');
const { SLIDER: SLIDER_SIZE } = require('../../config');
const path = require('path');

const editSliderPayload = slidersPayload(true);
const editSliderValidationSchema = checkSchema(editSliderPayload);

const editSlider = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const sliderData = extractRequiredFields(Object.keys(editSliderPayload), req.body);
  if (req.file) {
    const _slider = await Sliders.findById(id);

    // remove the previously saved slider image
    deleteFile(path.join(__dirname, `../../uploads/${_slider.image}`));

    sliderData.image = await resizeSliderImage(req.file.buffer, {
      height: SLIDER_SIZE.height,
      width: SLIDER_SIZE.width,
    });
  }

  if (!Object.keys(sliderData).length) {
    return res.status(400).json({ error: req.t('EMPTY_PAYLOAD') });
  }

  console.log(sliderData);
  const slider = await Sliders.findByIdAndUpdate(id, sliderData);

  if (!slider) {
    return res.status(404).json({ message: req.t('NOT_FOUND', { field: 'slider' }) });
  }

  res.status(200).json({ success: true });
});

module.exports = { editSlider, editSliderValidationSchema };
