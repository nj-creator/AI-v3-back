const winston = require("winston");

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({ level: "info" }),
    new winston.transports.Console({ level: "error" }),
    new winston.transports.File({
      level: "info",
      filename: "info.log",
      handleExceptions: true,
    }),
    new winston.transports.File({
      level: "error",
      filename: "error.log",
      handleExceptions: true,
    }),
  ],
  exitOnError: false,
  handleExceptions: true,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
});

module.exports = { logger };
