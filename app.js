const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes');
const { catchAndForwardError, staticHTMLErrorHandler } = require('./handlers/error');
const i18next = require('./locales');
const i18nextMiddleware = require('i18next-http-middleware');
const cors = require('cors');
const { NODE_ENV } = require('./config');
const { cloudinary } = require('./cloudinary');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors({
  origin: ['development', 'render'].includes(NODE_ENV),
  credentials: ['development', 'render'].includes(NODE_ENV),
  preflightContinue: ['development', 'render'].includes(NODE_ENV),
}));

console.log(cloudinary.url('uploads'));

app.use(i18nextMiddleware.handle(i18next));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(catchAndForwardError);

// error handler
app.use(staticHTMLErrorHandler);

module.exports = app;
