const { Schema, model } = require("mongoose");

const characterExpressionSchema = new Schema({
  character_id: String,
  expression: String,
});

const responseSchema = new Schema({
  scene_id: String,
  prompt: String,
  shot_type: String,
  location: String,
  original_script_chunk: String,
  director_tips: String,
  character_expressions: [characterExpressionSchema],
});

const SceneSchema = new Schema({
  title: String,
  script: String,
  location: String,
  genre: String,
  colorType: String,
  framesNumber: Number,
  createdDate: String,
  updatedDate: String,
  project: String,
  thumbnail: String,
  response: [responseSchema],
});

const Scene = model("Scene", SceneSchema);

module.exports = { Scene };
