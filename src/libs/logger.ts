import { createLogger, format, transports } from 'winston';
const config = require('config');
const { combine, timestamp, prettyPrint } = format;
const logOptions = {
  fileInfo: {
    level: 'info',
    filename: './log/info.log',
    handleExceptions: true,
    json: false,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  fileError: {
    level: 'error',
    filename: './log/error.log',
    handleExceptions: true,
    json: false,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  fileWarn: {
    level: "warn",
    filename: './log/warn.log',
    handleExceptions: true,
    json: false,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  fileDebug: {
    level: 'debug',
    filename: './log/debug.log',
    handleExceptions: true,
    json: false,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: true,
    colorize: true,
  },
};
const logger = createLogger({
  format: combine(
    timestamp(),
    format.printf(i => `${i.timestamp} | ${i.message}`)
  ),
  transports: [
    new transports.Console(logOptions.console),
    new transports.File(logOptions.fileInfo),
    new transports.File(logOptions.fileError),
    new transports.File(logOptions.fileWarn),
    new transports.File(logOptions.fileDebug),
  ],
  exitOnError: false,
});

export default logger;
