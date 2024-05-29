const { Router } = require("express");
const validationMiddleware = require("../middlewares/validation.middleware");
const { FrameValidator } = require("../validators/frame.validator");
const { verifyToken } = require("../middlewares/auth.middleware");
const { FrameController } = require("../controllers/frame.controller");
const { upload } = require("../middlewares/upload.middleware");

const frameRoute = Router();

frameRoute.get(
  "/get",
  [validationMiddleware(FrameValidator.generateFrames(), "url"), verifyToken],
  FrameController.generateFrames
);

frameRoute.post(
  "/regenerate",[upload.fields([
      { name: "maskImage", maxCount: 1 },
      { name: "baseImage", maxCount: 8 },
    ]),verifyToken],FrameController.regeneratedFrames
);

frameRoute.post(
  "/activeFrame",verifyToken,FrameController.updateActiveUrl
)

module.exports = { frameRoute };
