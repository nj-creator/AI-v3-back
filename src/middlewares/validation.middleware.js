const ResponseInterceptor = require("../interceptors/response.interceptor");

function validationMiddleware(Validator, from = "body") {
  return async (req, res, next) => {
    const response = new ResponseInterceptor(res);
    try {
      if (Validator) {
        await Validator.validateAsync(
          from === "url" ? req.query : from === "params" ? req.params : req.body
        );
      }
      return next();
    } catch (error) {
      console.log(error, "here");
      return response.badRequest(error.details[0].message);
    }
  };
}

module.exports = validationMiddleware;
