const SiteInfo = require('../../db/models/SiteInfo');
const { asyncHandler, ErrorMessages } = require('../../handlers/error');

const sendsocialMedia = asyncHandler(async (req, res, next) => {
  const infoData = await SiteInfo.findOne({}, { social: 1, _id: 0 });
  if (!infoData) {
    return res.status(404).json(ErrorMessages.NOT_FOUND(req, 'social'));
  }
  
  res.status(200).json(infoData?.social || []);
});

module.exports = {
  sendsocialMedia,
};

