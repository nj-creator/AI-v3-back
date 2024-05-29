const { Router } = require("express");
const validationMiddleware = require("../middlewares/validation.middleware");
const { ProjectValidator } = require("../validators/project.validator");
const { ProjectController } = require("../controllers/project.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

const projectRoute = Router();

projectRoute.post(
  "/create",
  [validationMiddleware(ProjectValidator.createProject()), verifyToken],
  ProjectController.createProject
);

projectRoute.get("/", verifyToken, ProjectController.getProjects);

module.exports = { projectRoute };
