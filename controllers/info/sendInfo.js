const SiteInfo = require('../../db/models/SiteInfo');
const { asyncHandler, ErrorMessages } = require('../../handlers/error');


const sendAboutUs = asyncHandler(async (req, res, next) => {
  const infoData = await SiteInfo.findOne({});
  
  if (!infoData) {
    return res.status(404).json(ErrorMessages.NOT_FOUND(req, 'info'));
  }

  res.status(200).json(infoData || {});
});

module.exports = {
  sendAboutUs,
};

