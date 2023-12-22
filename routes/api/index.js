const express = require('express');
const router = express.Router();
const authRouter = require('./auth');
const usersRouter = require('./users');
const slidersRouter = require('./sliders');
const { JSONErrorHandler, asyncErrorHandler } = require('../../handlers/error');

// handling routes
router.get('/', (req, res) => res.json({ message: 'welcome to api' }));
router.use('/', authRouter);
router.use('/users', usersRouter);
router.use('/sliders', slidersRouter);

router.use(asyncErrorHandler);
router.use(JSONErrorHandler);


module.exports = router;
