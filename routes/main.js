const express = require('express');
const { renderMainPage } = require('../controllers/main/renderMainPage');
const { sendLogo } = require('../controllers/main/sendLogo');
const router = express.Router();

/* GET home page. */
router.get('/', renderMainPage);
router.get('/favicon.ico', sendLogo);

module.exports = router;
