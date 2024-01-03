const { asyncHandler } = require('../../handlers/error');
const Sliders = require('../../db/models/Sliders');
// const fs = require('fs');
// const path = require('path');
const { logger } = require('../../logger');
const { cleanupFiles } = require('../../cloudinary');

const deleteSlider = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const slider = await Sliders.findByIdAndDelete(id);
  if (!slider) {
    return res.status(404).json({ message: req.t('NOT_FOUND', { field: id }) });
  }

  try {
    cleanupFiles(slider, 'fileName');
    // fs.unlinkSync(path.join(__dirname, `../../uploads/${slider.image}`));
  } catch (err) {
    logger.error(err);
  }

  res.status(200).json({ success: true });
});

module.exports = { deleteSlider };

