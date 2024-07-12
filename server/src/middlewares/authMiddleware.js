const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const verifiedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.body.userName = verifiedToken.userName;
    next();
  } catch (err) {
    res.status(401).send({
      success: false,
      message: "Invalid token!",
    });
  }
};
