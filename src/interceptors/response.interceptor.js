class ResponseInterceptor {
  #res;
  constructor(response) {
    this.#res = response;
  }
  #handle({
    data,
    success_code,
    fail_code,
    cookieData,
    cookieKey,
    cookieValue,
    clearCookie = false,
  }) {
    if (success_code) {
      // console.log(data);
      if (clearCookie && cookieKey) {
        return this.#res
          .status(success_code)
          .clearCookie(cookieKey, cookieData)
          .send({ success: true, data, error: {} });
      }
      if (cookieData && cookieKey && cookieValue) {
        return this.#res
          .status(success_code)
          .cookie(cookieKey, cookieValue, cookieData)
          .send({ success: true, data, error: {} });
      }
      return this.#res
        .status(success_code)
        .send({ success: true, data, error: {} });
    }
    return this.#res
      .status(fail_code)
      .send({ success: false, error: data, data: {} });
  }
  created(data) {
    return this.#handle({ data, success_code: 201 });
  }
  okWithCookie(data, cookieKey, cookieValue, cookieData) {
    return this.#handle({
      data,
      success_code: 200,
      cookieKey,
      cookieData,
      cookieValue,
    });
  }
  redirect(url, { cookieKey, cookieValue, cookieData, clearCookie = false }) {
    if (cookieData && cookieKey && cookieValue) {
      return this.#res.cookie(cookieKey, cookieValue, cookieData).redirect(url);
    }
    if (cookieKey && clearCookie) {
      return this.#res.clearCookie(cookieKey, cookieData).redirect(url);
    }
    return this.#res.redirect(url);
  }
  okWithRemoveCookie(data, cookieKey, cookieData) {
    return this.#handle({
      data,
      success_code: 200,
      cookieKey,
      clearCookie: true,
      cookieData,
    });
  }
  ok(data) {
    return this.#handle({ data, success_code: 200 });
  }
  badRequest(message) {
    return this.#handle({
      data: {
        message: message || "",
      },
      fail_code: 400,
    });
  }
  unauthorized(message, cookieKey, cookieData) {
    return this.#handle({
      data: {
        message: message || "",
      },
      fail_code: 401,
      clearCookie: true,
      cookieKey,
      cookieData,
    });
  }

  forbidden(message, cookieKey, cookieData) {
    return this.#handle({
      data: {
        message: message || "",
      },
      fail_code: 403,
      clearCookie: true,
      cookieKey,
      cookieData,
    });
  }

  notFound(message) {
    return this.#handle({
      data: {
        message: message || "",
      },
      fail_code: 404,
    });
  }

  unprocessableEntity(message) {
    return this.#handle({
      data: {
        message: message || "Invalid Data",
      },
      fail_code: 422,
    });
  }

  internalServerError(message) {
    return this.#handle({
      data: {
        message: message || "Internal Server Error.",
      },
      fail_code: 500,
    });
  }
}

module.exports = ResponseInterceptor;
