const { asyncHandler } = require('../../handlers/error');
const Sliders = require('../../db/models/Sliders');
const { query } = require('express-validator');
const { SLIDER } = require('../../config');

const validateSlidersTypes = query('type')
  .isIn(SLIDER.type)
  .withMessage((value, { req }) => req.t('INVALID_MSG', {
    field: 'type',
  }));

const sendSliders = asyncHandler(async (req, res) => {
  const { type, skip = 0, limit = 14 } = req.query;
  const sliders = await Sliders.find({ type }, {}, { skip: Number(skip), limit: Number(limit) });
  const numberOfSliders = await Sliders.countDocuments({ type });
  res.status(200).json({ data: sliders, length: numberOfSliders });
});

module.exports = { sendSliders, validateSlidersTypes };
