const { Schema, model } = require("mongoose");

const CharacterSchema = new Schema({
  character_id: String,
  name: String,
  age: Number,
  gender: String,
  project: String,
});

const Character = model("Character", CharacterSchema);

module.exports = { Character };
