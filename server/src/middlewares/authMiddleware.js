const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).json({
      success: false,
      message: "No token provided. Authorization header is missing.",
    });
  }

  const authHeader = req.headers.authorization;
  const tokenParts = authHeader.split(" ");

  if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
    return res.status(401).json({
      success: false,
      message: "Invalid Authorization header format. Expected 'Bearer <token>'.",
    });
  }

  const token = tokenParts[1];

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
    if (decodedToken.exp && Date.now() >= decodedToken.exp * 1000) {
      return res.status(401).json({
        success: false,
        message: "Token has expired. Please log in again.",
      });
    }

    req.user = decodedToken;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      switch (error.name) {
        case "TokenExpiredError":
          return res.status(401).json({
            success: false,
            message: "Token has expired. Please log in again.",
          });
        case "NotBeforeError":
          return res.status(401).json({
            success: false,
            message: "Token not active. Please try again later.",
          });
        default:
          return res.status(401).json({
            success: false,
            message: "Invalid token. Please log in again.",
          });
      }
    } else {
      console.error("Authentication error:", error);
      return res.status(500).json({
        success: false,
        message: "An unexpected error occurred during authentication.",
      });
    }
  }
};