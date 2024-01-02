const express = require('express');
const router = express.Router();
const apiRouter = require('./api');
const mainRouter = require('./main');
const uploadsRouter = require('./uploads');

/* GET home page. */
router.use('/api', apiRouter);
router.use('/uploads', uploadsRouter);
router.use('/', mainRouter);


module.exports = router;
