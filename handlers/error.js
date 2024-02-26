/* eslint-disable no-unused-vars */
const createHttpError = require('http-errors');
const { NODE_ENV } = require('../config');
const { logger } = require('../logger');

// catch 404 and forward to error handler
const catchAndForwardError = function (req, res, next) {
  next(createHttpError(404));
};

const staticHTMLErrorHandler = function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = NODE_ENV === 'development' ? err : {};
  res.locals.status = err.status || 500;
  // render the error page
  res.status(res.locals.status).render('error');
};

const JSONErrorHandler = function (err, req, res, next) {
  // set locals, only providing error in development
  const error = NODE_ENV === 'development' ? err : { error: err.message };
  const status = err.status || 500;
  // render the error page
  res.status(status).json({ error: { message: err.message } });
};

const asyncErrorHandler = function (err, req, res, next) {
  if (err.errorHander === 'asyncHandler') {
    // handle async errors
  }

  next(err);
};

const ErrorMessages = {
  NOT_FOUND: (req, field) => ({ error: { message: req.t('NOT_FOUND', { field }) } }),
};

const asyncHandler = function (asyncFunction) {
  return async function (req, res, next) {
    const route = req.originalUrl;
    const { baseUrl, path } = req;
    try {
      await asyncFunction(req, res, next);
    } catch (err) {
      logger.error(err);
      err.status = 400;
      err.errorHander = 'asyncHandler';
      err.route = route;
      err.baseUrl = baseUrl;
      err.path = path;
      next(err);
    }
  };
};


module.exports = {
  catchAndForwardError,
  staticHTMLErrorHandler,
  JSONErrorHandler,
  asyncErrorHandler,
  asyncHandler,
  ErrorMessages,
};
