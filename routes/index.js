const express = require('express');
const router = express.Router();
const apiRouter = require('./api');
const mainRouter = require('./main');

/* GET home page. */
router.use('/api', apiRouter);
router.use('/', mainRouter);


module.exports = router;
