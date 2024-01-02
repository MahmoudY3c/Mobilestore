const { cloudinary } = require('../cloudinary');

const passCloudinaryPath = (req, res, next) => {
  let url = new URL(cloudinary.url('uploads'));
  url = url.protocol === 'http:'
    ? `https://${url.host}${url.pathname}`
    : url.href;

  // console.log(url);
  req.filePath = url;
  next();
};

module.exports = passCloudinaryPath;

