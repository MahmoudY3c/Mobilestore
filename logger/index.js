const winston = require('winston');
const { createLogger, format, transports } = winston;
require('winston-daily-rotate-file');
const path = require('path');
const { NODE_ENV } = process.env;
const { dates } = require('../handlers/time');
const { combine, timestamp, colorize, json, simple, errors } = format;

const _console = new transports.Console({
  level: 'debug',
  format: combine(
    colorize(),
    simple(),
  ),
  handleExceptions: true,
  handleRejections: true,
});

const processFiles = new transports.DailyRotateFile({
  level: 'debug',
  filename: 'process-exception-%DATE%.log',
  dirname: path.resolve(__dirname, 'logs'),
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxFiles: '14d',
  handleExceptions: true,
  handleRejections: true,
});

const rotatedFiles = new transports.DailyRotateFile({
  level: 'info',
  filename: 'log-%DATE%.log',
  dirname: path.resolve(__dirname, 'logs'),
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxFiles: '14d',
});


function _logger() {
  return createLogger({
    // level: 'info',
    format: combine(
      timestamp({
        format: dates.KsaTime,
      }),
      errors({ stack: true }),
      json(),
    ),
  });
}

const logger = _logger();

if (NODE_ENV === 'development') {
  logger.add(_console).add(rotatedFiles);
} else {
  logger.add(rotatedFiles);
}

// Call exceptions.handle with a transport to handle exceptions
logger.exceptions.handle(
  processFiles, _console,
);

module.exports = {
  logger,
};
