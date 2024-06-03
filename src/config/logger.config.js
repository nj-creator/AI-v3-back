const winston = require("winston");
// const { AWS_LOCATION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = require("./env.config");
// require("winston-cloudwatch");
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

// const loggerTest =winston.createLogger({
//   transports: [
//     new winston.transports.Console(),
//     new winston.transports.CloudWatch({
//       logGroupName: 'testing-mern',
//       logStreamName: 'backend-logs',
//       awsRegion: AWS_LOCATION,
//       awsAccessKeyId: AWS_ACCESS_KEY_ID,
//       awsSecretKey: AWS_SECRET_ACCESS_KEY,
//       messageFormatter: ({ time, name, levelName, request_id, message }) => {return `${time} - ${name} - ${levelName} - ${request_id} - ${message}`},
//       onError: (err) => {
//         console.error('Error sending logs to CloudWatch:', err);
//       }
//     })
//   ],
//   exitOnError: false
// });

module.exports = { logger };
