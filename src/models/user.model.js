const { Schema, model } = require("mongoose");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, EXPIRE } = require("../config/env.config");

const UserSchema = new Schema({
  name: String,
  email: String,
  createdDate: String,
  uniqueId: String,
  active: { type: Boolean, default: true },
  generatedFrames: Number,
  regeneratedFrames: Number,
  socketId: { type: String, default: "" },
  stripeCustomerId: String,
  subscriptionEndDate: String,
  subscriptionCancelled: { type: Boolean, default: false },
  subscriptionCancelledDate: String,
  subscriptionRenewalDate: String,
});

UserSchema.methods = {
  generateToken() {
    return jwt.sign(
      {
        name: this.name,
        email: this.email,
        active: this.active,
        userId: this._id,
      },
      JWT_SECRET,
      { expiresIn: Number(EXPIRE) }
    );
  },
};

const User = model("User", UserSchema);

module.exports = { User };
