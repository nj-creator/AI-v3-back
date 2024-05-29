require("dotenv").config();

const {
  DB_URL,
  PORT,
  JWT_SECRET,
  EXPIRE,
  AUTH_KEY,
  SAME_SITE,
  NODE_ENV,
  AWS_ACCESS_KEY,
  AWS_SECRET_ACCESS_KEY,
  AWS_LOCATION,
} = process.env;

const cookieOptions = {
  httpOnly: NODE_ENV === "production", //accessible only by web server
  secure: NODE_ENV === "production", //https
  sameSite: SAME_SITE, //cross-site cookie
  maxAge: Number(EXPIRE), //cookie expiry: set to match rT
};

if (NODE_ENV !== "production") {
  delete cookieOptions.sameSite;
}

module.exports = {
  DB_URL,
  PORT,
  JWT_SECRET,
  EXPIRE,
  AUTH_KEY,
  SAME_SITE,
  NODE_ENV,
  cookieOptions,
  AWS_ACCESS_KEY,
  AWS_SECRET_ACCESS_KEY,
  AWS_LOCATION,
};
