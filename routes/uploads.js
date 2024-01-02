const express = require('express');
const passCloudinaryPath = require('../middleware/passCloudinaryPath');
const { sendFileByNameFromCloudinary } = require('../controllers/uploads/sendFileByNameFromCloudinary');
const router = express.Router();


router.get(
  '/:filename',
  passCloudinaryPath,
  sendFileByNameFromCloudinary,
);


module.exports = router;
