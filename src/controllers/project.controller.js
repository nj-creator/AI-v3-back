const { logger } = require("../config/logger.config");
const ResponseInterceptor = require("../interceptors/response.interceptor");
const { Project } = require("../models/project.model");
const { Scene } = require("../models/scene.model");

class ProjectController {
  static async createProject(req, res) {
    const response = new ResponseInterceptor(res);

    try {
      const { userId } = req.user;
      const { name, style, aspectRatio } = req.body;

      const data = await Project.create({
        name: name.trim(),
        style,
        aspectRatio,
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
        user: userId,
      });

      logger.info(data);
      return response.created(data);
    } catch (error) {
      logger.error(error?.message || "Error occured while creating project");

      return response.internalServerError();
    }
  }
  static async getProjects(req, res) {
    const response = new ResponseInterceptor(res);

    try {
      const { userId } = req.user;

      const data = await Project.find({ user: userId });

      for (const project of data) {
        if (!project?.thumbnail || project.thumbnail === "") {
          const scene = await Scene.find({ project: project._id });

          if (
            scene &&
            scene.length > 0 &&
            scene[0].thumbnail &&
            scene[0].thumbnail !== ""
          ) {
            project.thumbnail = scene[0].thumbnail;
            project.colorType = scene[0].colorType;

            await project.save();
          }
        }
      }

      logger.info(data);
      return response.ok(data);
    } catch (error) {
      logger.error(error?.message || "Error occured while getting projects");

      return response.internalServerError();
    }
  }
}

module.exports = { ProjectController };
