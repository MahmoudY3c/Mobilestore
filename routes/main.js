const express = require('express');
const { renderMainPage } = require('../controllers/main/renderMainPage');
const router = express.Router();

/* GET home page. */
router.get('/', renderMainPage);

module.exports = router;
