const cookieParser = require("cookie-parser");
const { connectDb } = require("./src/config/db.config");
const { logger } = require("./src/config/logger.config");
const express = require("express");
const cors = require("cors");
const compression = require("compression");
const { connection } = require("mongoose");
const { PORT } = require("./src/config/env.config");
const { userRoute } = require("./src/routes/user.route");
const { projectRoute } = require("./src/routes/project.route");
const { sceneRoute } = require("./src/routes/scene.route");
const { frameRoute } = require("./src/routes/frame.route");
const { io, app, server } = require("./src/config/server.config");

class App {
  constructor() {
    this.#dbConfig();
    this.#config();
    this.#routeConfig();
  }
  #config() {
    app.use(cookieParser());

    app.use(
      cors({
        origin: [
          "http://localhost:5173",
          "https://immersfy-v3.vercel.app",
          "https://beta.immersfy.com",
        ],
        credentials: true,
      })
    );

    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(compression());
  }
  #dbConfig() {
    connectDb();
  }
  #routeConfig() {
    app.use("/api/user", userRoute);
    app.use("/api/project", projectRoute);
    app.use("/api/scene", sceneRoute);
    app.use("/api/frame", frameRoute);
  }

  startServer() {
    connection.on("connected", () => {
      logger.info(`DB is connected`);
      server.listen(PORT, () => {
        logger.info(`Server is running on PORT ${PORT}`);
      });
    });
  }
}

const ourApp = new App();
module.exports = { ourApp, io: app.io };
