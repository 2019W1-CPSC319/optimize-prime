const winston = require('winston');
const path = require('path');

module.exports = (logDir = './log') => {
  const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.json(),
    transports: [
      //
      // - Write to all logs with level `info` and below to `combined.log`
      // - Write all logs error (and below) to `error.log`.
      //
      new winston.transports.File({
        filename: path.resolve(logDir, './error.log'),
        tailable: true,
        maxsize: 1024 * 1024 * 5,
        level: 'error',
      }),
      new winston.transports.File({
        filename: path.resolve(logDir, './combined.log'),
        tailable: true,
        maxsize: 1024 * 1024 * 5,
        maxFiles: 10,
      }),
    ],
    exceptionHandlers: [
      new winston.transports.File({
        filename: path.resolve(logDir, './exceptions.log'),
        tailable: true,
        maxsize: 1024 * 1024 * 5,
      }),
    ],
  });

  //
  // If we're not in production then log to the `console` with the format:
  // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
  //
  if (process.env.NODE_EVN !== 'production') {
    logger.add(new winston.transports.Console({
      format: winston.format.simple(),
    }));
  }

  return logger;
};
