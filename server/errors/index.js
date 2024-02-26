const BadRequest = require("./BadRequest");
const CustomError = require("./CustomError");
const NotFound = require("./NotFound");
const Unauthenticated = require("./Unauthenticated");
const Unauthorized = require("./Unauthorized");

module.exports = {
  BadRequest,
  Unauthenticated,
  Unauthorized,
  NotFound,
  CustomError,
};
