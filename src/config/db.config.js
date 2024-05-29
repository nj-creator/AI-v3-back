const { connect, connection } = require("mongoose");
const { logger } = require("./logger.config");
const { DB_URL } = require("./env.config");

const connectDb = () => {
  connection.on("connected", () => {
    logger.info("Mongo Connection Established");
  });
  connection.on("reconnected", () => {
    logger.info("Mongo Connection Reestablished");
  });
  connection.on("disconnected", () => {
    logger.error("Mongo Connection Disconnected");
    logger.info("Trying to reconnect to Mongo ...");
    setTimeout(() => {
      connect(DB_URL, {
        // keepAlive: true,
        socketTimeoutMS: 3000,
        connectTimeoutMS: 3000,
      });
    }, 3000);
  });
  connection.on("close", () => {
    logger.error("Mongo Connection Closed");
  });
  connection.on("error", (error) => {
    logger.error(`Mongo Connection ERROR: ${error}`);
  });
  const run = async () => {
    await connect(DB_URL, {
      //   keepAlive: true,
    });
  };
  run().catch((error) => logger.error("mongo error", error));
};

module.exports = {
  connectDb,
};
