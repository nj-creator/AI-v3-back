const { Router } = require("express");
const validationMiddleware = require("../middlewares/validation.middleware");
const { UserValidator } = require("../validators/user.validator");
const { UserController } = require("../controllers/user.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

const userRoute = Router();

userRoute.post(
  "/descope",
  [validationMiddleware(UserValidator.descopeFunction())],
  UserController.descopeFunction
);
userRoute.get("/profile", verifyToken, UserController.profile);
userRoute.get("/logout", verifyToken, UserController.logout);

module.exports = { userRoute };
