const { Schema, model } = require("mongoose");

const ProjectSchema = new Schema({
  name: String,
  thumbnail: String,
  style: String,
  aspectRatio: String,
  createdDate: String,
  updatedDate: String,
  user: String,
  colorType: String,
});

const Project = model("Project", ProjectSchema);

module.exports = { Project };
