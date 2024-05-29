const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./env.config");

const JWTVerify = (authorization, callback) => {
  const token = authorization.replace(/bearer /i, "");
  jwt.verify(token, JWT_SECRET, callback);
};

module.exports = {
  JWTVerify,
};
