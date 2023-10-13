const sanitizer = require("sanitizer");

const paramsSanitizer = (req, res, next) => {
  if (req.params) {
    for (let propName in req.params) {
      req.params[propName] = sanitizer.escape(req.params[propName]);
    }
  }
  next();
};

module.exports = paramsSanitizer;