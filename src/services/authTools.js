const userSchema = require("./users/schema");
const atob = require("atob");

const errorFormat = async (msg, code) => {
  const error = new Error();
  error.message = msg;
  error.httpStatusCode = code;
  return error;
};

const basicAuth = async (req, res, next) => {
  if (!req.headers.authorization) {
    next(await errorFormat("Auth missing.", 401));
  } else {
    const [email, password] = atob(req.headers.authorization.split(" ")[1]).split(":");
    const user = await userSchema.findByCredentials(email, password);
    if (!user) {
      next(await errorFormat("Invalid email/password.", 401));
    } else {
      req.user = user;
    }
    next();
  }
};

const adminAuth = async (req, res, next) => {
  if (!req.headers.authorization) {
    next(await errorFormat("Auth missing.", 401));
  } else {
    const [email, password] = atob(req.headers.authorization.split(" ")[1]).split(":");
    const user = await userSchema.findByCredentials(email, password);
    if (!user) {
      next(await errorFormat("Invalid email/password.", 401));
    } else {
      if (!user.role === "admin") {
        next(await errorFormat("No Permissions.", 401));
      } else {
        req.user = user;
      }
    }
    next();
  }
};

module.exports = { basicAuth, adminAuth };
