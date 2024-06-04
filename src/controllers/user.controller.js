const { AUTH_KEY, cookieOptions } = require("../config/env.config");
const { logger } = require("../config/logger.config");
const ResponseInterceptor = require("../interceptors/response.interceptor");
const { User } = require("../models/user.model");
const { CreateCustomer } = require("./stripe.controller");

class UserController {
  static async descopeFunction(req, res) {
    const response = new ResponseInterceptor(res);

    try {
      const { email, name, uniqueId } = req.body;

      const userEmail = email.trim().toLowerCase();

      const userExist = await User.findOne({ email: userEmail });

      if (userExist) {
        logger.info(userExist);
        return response.okWithCookie(
          userExist,
          AUTH_KEY,
          userExist.generateToken(),
          cookieOptions
        );
      } else {
        const StripeCustomerId = await CreateCustomer(email, name);
        const data = await User.create({
          name,
          email,
          uniqueId,
          createdDate: new Date().toISOString(),
          generatedFrames: 0,
          regeneratedFrames: 0,
          stripeCustomerId:StripeCustomerId
        });

        logger.info(data);

        return response.okWithCookie(
          data,
          AUTH_KEY,
          data.generateToken(),
          cookieOptions
        );
      }
    } catch (error) {
      logger.error(error?.message || "login descope function");

      return response.internalServerError();
    }
  }

  static async profile(req, res) {
    const response = new ResponseInterceptor(res);

    try {
      const { userId } = req.user;

      const userExist = await User.findById(userId).exec();

      if (userExist) {
        if (userExist.active) {
          return response.ok(userExist);
        } else {
          return response.forbidden("Inactive user!", AUTH_KEY, cookieOptions);
        }
      } else {
        return response.forbidden("No user found!", AUTH_KEY, cookieOptions);
      }
    } catch (error) {
      logger.error(error?.message || "get profile error");

      return response.unauthorized("Unauthorized", AUTH_KEY, cookieOptions);
    }
  }

  static async logout(req, res) {
    const response = new ResponseInterceptor(res);

    try {
      const { userId } = req.user;

      logger.info(`${userId} logged out`);

      return response.okWithRemoveCookie("success", AUTH_KEY, cookieOptions);
    } catch (error) {
      console.log(error, "logout error");

      return response.badRequest("Logout function error");
    }
  }
}

module.exports = { UserController };
