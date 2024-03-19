const SiteInfo = require('../../db/models/SiteInfo');
const { asyncHandler, ErrorMessages } = require('../../handlers/error');
const axios = require('axios');
const createHttpError = require('http-errors');

const sendLogo = asyncHandler(async (req, res, next) => {
  const infoData = await SiteInfo.findOne();
  if (!infoData || !(infoData?.logo?.image)) {
    res.set('Content-Type', 'image/jpeg');
    return res.sendStatus(404);
  }

  try {
    const controller = new AbortController();

    // Fetch the image from Cloudinary and stream it to the client
    const response = await axios({
      url: infoData.logo.image,
      method: 'GET',
      responseType: 'stream',
      signal: controller.signal,
    });


    if (response.status !== 200) {
      return next(createHttpError(404));
    }

    // Set the appropriate content type for the image
    const type = response.headers['content-type'].split('/');
    res.set('Content-Disposition', `filename="${infoData.logo.fileTitle}"`);
    res.set('Content-Type', response.headers['content-type']);

    // Check if the client has a cached version of the image
    const clientLastModified = req.headers['if-modified-since'];
    const serverLastModified = response.headers['last-modified'];

    if ((clientLastModified && serverLastModified) && (clientLastModified === serverLastModified)) {
      // cancel the request
      controller.abort();
      // The client has a cached version of the image, send a 304 Not Modified response
      res.status(304).end();
    } else {
      // The client does not have a cached version, send the image data
      res.set('Last-Modified', serverLastModified);
      response.data.pipe(res);
    }
  } catch (e) {
    return next(createHttpError(404));
  }
});

module.exports = {
  sendLogo,
};

