const { Schema, model } = require("mongoose");

const FrameSchema = new Schema({
  prompt: String,
  genre: String,
  location: Number,
  colorType: String,
  framesUrl: [String],
  scene: String,
});

const Frame = model("Frame", FrameSchema);

module.exports = { Frame };
