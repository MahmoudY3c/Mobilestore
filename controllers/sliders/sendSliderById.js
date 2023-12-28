const { asyncHandler } = require('../../handlers/error');
const Sliders = require('../../db/models/Sliders');
const sendSliderById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const slider = await Sliders.findOne({ _id: id });
  
  if (!slider) {
    throw new Error(req.t('NOT_FOUND', { field: 'user' }));
  }

  res.status(200).json(slider);
});

module.exports = { sendSliderById };
