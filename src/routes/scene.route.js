const { Router } = require("express");
const validationMiddleware = require("../middlewares/validation.middleware");
const { verifyToken } = require("../middlewares/auth.middleware");
const { SceneValidator } = require("../validators/scene.validator");
const { SceneController } = require("../controllers/scene.controller");

const sceneRoute = Router();

sceneRoute.post(
  "/create",
  [validationMiddleware(SceneValidator.createScene()), verifyToken],
  SceneController.createScene
);

sceneRoute.get(
  "/",
  [validationMiddleware(SceneValidator.getScene(), "url"), verifyToken],
  SceneController.getScenes
);
sceneRoute.get(
  "/details",
  [validationMiddleware(SceneValidator.getSceneDetails(), "url"), verifyToken],
  SceneController.getSceneDetails
);

module.exports = { sceneRoute };
