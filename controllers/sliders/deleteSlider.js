const { asyncHandler } = require('../../handlers/error');
const Sliders = require('../../db/models/Sliders');
const fs = require('fs');
const path = require('path');
const { logger } = require('../../logger');

const deleteSlider = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const image = await Sliders.findByIdAndDelete(id);
  if (!image) {
    return res.status(404).json({ message: req.t('NOT_FOUND', { field: id }) });
  }

  try {
    fs.unlinkSync(path.join(__dirname, `../../uploads/${image.image}`));
  } catch (err) {
    logger.error(err);
  }

  res.status(200).json({ success: true });
});

module.exports = { deleteSlider };

