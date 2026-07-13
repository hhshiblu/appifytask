const jwt = require('jsonwebtoken');


const authMiddleware = (req, res, next) => {
  try {
    console.log("req", req.cookies);
    let token = req.cookies?.token;
    console.log("token", token);
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized ! Please login.',
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("decoded", decoded);
      req.user = decoded;
      next();
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expired. Please login again.',
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication error',
    });
  }
};

module.exports = authMiddleware;