const { IMAGE_TYPES } = require('../config');
const { asyncHandler } = require('../handlers/error');

const validateImages = (optional, isMultiple) => asyncHandler(async (req, res, next) => {
  const files = isMultiple ? req.files : { file: [req.file] };
  if (optional) {
    if (!req.file || !req.files) {
      return next();
    }
  }

  const isAllValid = Object.keys(files).every(e => files[e].every(a => {
    let fileType = a.mimetype.split('/');
    fileType = fileType[fileType.length - 1];

    return IMAGE_TYPES.includes(fileType.toUpperCase());
  }));

  if (!isAllValid) {
    return res.status(400).json({
      error: req.t('UNSUPPORTED_DATATYPE', {
        supported: IMAGE_TYPES.join(', '),
      }),
    });
  }

  next();
});

module.exports = validateImages;
