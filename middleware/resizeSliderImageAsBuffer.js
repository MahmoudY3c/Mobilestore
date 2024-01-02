const sharp = require('sharp');
const { SLIDER: SLIDER_SIZE } = require('../config');

const resizeSliderImageAsBuffer = (type, { height = SLIDER_SIZE.height, width = SLIDER_SIZE.width } = {}) => {
  const isSingleFile = type === 'single';
  return async (req, res, next) => {
    if (isSingleFile) {
      const fileBuffer = req.file.buffer;
      const buffer = await sharp(fileBuffer)
        .resize(width, height, {
          // fit: sharp.fit.inside,
          // fit: 'contain',
          // fit: 'inside',
          fit: 'fill',
        })
        .toBuffer();

      req.file = { ...req.file, buffer, height, width };
    } else {
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const fileBuffer = file.buffer;
        const buffer = await sharp(fileBuffer)
          .resize(width, height)
          .toBuffer();

        req.files[i] = { ...file, buffer, height, width };
      }
    }

    next();
  };
};

module.exports = resizeSliderImageAsBuffer;

