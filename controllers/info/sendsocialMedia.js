const SiteInfo = require('../../db/models/SiteInfo');
const { asyncHandler, ErrorMessages } = require('../../handlers/error');
const createHttpError = require('http-errors');



const sendsocialMedia = asyncHandler(async (req, res, next) => {
  const infoData = await SiteInfo.findOne({}, { facebook: 1, twitter: 1, tiktok: 1, telegram: 1, whatsapp: 1, phoneNumber: 1, _id: 0 });
  if (!infoData) {
    return res.status(404).json(ErrorMessages.NOT_FOUND(req, 'about-us'));
  }
  
  res.status(200).json(infoData);
});

module.exports = {
  sendsocialMedia,
};

