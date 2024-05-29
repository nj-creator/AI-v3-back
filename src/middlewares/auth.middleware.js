const { JWTVerify } = require("../config/auth.token.config");
const { AUTH_KEY, cookieOptions } = require("../config/env.config");
const { logger } = require("../config/logger.config");
const ResponseInterceptor = require("../interceptors/response.interceptor");

const verifyToken = (req, res, next) => {
  const { token } = req.cookies || {};
  const response = new ResponseInterceptor(res);

  if (!token) {
    logger.warn("No Auth Token");
    response.forbidden("No token provided!", AUTH_KEY, cookieOptions);
    return;
  }

  JWTVerify(token, (err, decoded) => {
    if (err) {
      logger.warn("Invalid Token");
      response.unauthorized("Invalid Token!", AUTH_KEY, cookieOptions);
      return;
    }
    req.user = decoded;
    next();
  });
};

module.exports = { verifyToken };
