const { asyncHandler, ErrorMessages } = require('../../handlers/error');
const Sliders = require('../../db/models/Sliders');
const { checkSchema } = require('express-validator');
const { slidersPayload } = require('./createSlider');
const { extractRequiredFields } = require('../../handlers');
const { cleanupFiles } = require('../../cloudinary');

const editSliderPayload = slidersPayload(true);
const editSliderValidationSchema = checkSchema(editSliderPayload);

const editSlider = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { result } = req;
  const sliderData = extractRequiredFields(Object.keys(editSliderPayload), req.body);

  if (result) {
    sliderData.fileName = result.filename;
    sliderData.fileTitle = result.fileTitle;
    sliderData.image = result.fileUrl;
  }

  if (!Object.keys(sliderData).length) {
    return res.status(400).json({ error: { message: req.t('EMPTY_PAYLOAD') } });
  }

  // console.log(sliderData);
  const slider = await Sliders.findByIdAndUpdate(id, sliderData);
  if (result) {
    cleanupFiles(slider);
  }

  if (!slider) {
    return res.status(404).json(ErrorMessages.NOT_FOUND(req, 'slider'));
  }

  res.status(200).json({ success: true });
});

module.exports = { editSlider, editSliderValidationSchema };
