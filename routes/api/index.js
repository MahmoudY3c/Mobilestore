const express = require('express');
const router = express.Router();
const authRouter = require('./auth');
const usersRouter = require('./users');
const slidersRouter = require('./sliders');
const categoriesRouter = require('./categories');
const productsRouter = require('./products');
const repairServicesRouter = require('./repairServices');
const { JSONErrorHandler, asyncErrorHandler } = require('../../handlers/error');
const { checkAuth } = require('../../middleware/jwt/checkAuth');

// handling routes
router.get('/', (req, res) => res.json({ message: 'welcome to api' }));
router.use('/', authRouter);
router.use('/users', checkAuth, usersRouter);
router.use('/sliders', slidersRouter);
router.use('/categories', categoriesRouter);
router.use('/products', productsRouter);
router.use('/repair-services', checkAuth, repairServicesRouter);

router.use(asyncErrorHandler);
router.use(JSONErrorHandler);


module.exports = router;
