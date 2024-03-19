const SiteInfo = require('../../db/models/SiteInfo');
const { asyncHandler, ErrorMessages } = require('../../handlers/error');
const createHttpError = require('http-errors');


const sendAboutUs = asyncHandler(async (req, res, next) => {
  const infoData = await SiteInfo.findOne({}, { name: 1, description: 1, _id: 0 });
  console.log(infoData)
  if (!infoData) {
    return res.status(404).json(ErrorMessages.NOT_FOUND(req, 'about-us'));
  }

  res.status(200).json(infoData);
});

module.exports = {
  sendAboutUs,
};

