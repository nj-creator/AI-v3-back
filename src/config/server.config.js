const http = require("http");
const express = require("express");

const socketIO = require("socket.io");
const { logger, loggerTest } = require("./logger.config");
const { User } = require("../models/user.model");
class Server {
  #app;
  #server;
  #io;

  constructor() {
    this.#config();
    this.#setupSocketIO();
  }
  #config() {
    this.#app = express();
    this.#server = http.createServer(this.#app);
  }

  #setupSocketIO() {
    this.#io = new socketIO.Server(this.#server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    this.#io.on("connection", (socket) => {
      logger.info(`socket connected with socketId: ${socket.id}`);
      loggerTest.info({time:new Date().toISOString(),name:"connection",levelName:"INFO",request_id:"124",message:"connected"})

      socket.on("newUser", async (userId) => {
        try {
          await User.findByIdAndUpdate(userId, { socketId: socket.id });
          logger.info(`socket id updated for userId: ${userId}`);
        } catch (error) {
          logger.error(`socket new user error userId: ${userId}`);
        }
      });

      socket.on("disconnect", () => {
        console.log("A client disconnected");
      });
    });
  }

  get io() {
    return this.#io;
  }
  get server() {
    return this.#server;
  }
  get app() {
    return this.#app;
  }
}

const server = new Server();

module.exports = { server: server.server, app: server.app, io: server.io };
