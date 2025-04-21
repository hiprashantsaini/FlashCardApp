const jwt = require('jsonwebtoken');
const User = require('../models/user');

const isLogin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    console.log("authHeader :",authHeader);

    // Check if the header is present and starts with "Bearer"
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1]; // Extract token
    const payload = jwt.verify(token, 'my_secret_key'); // Verify token

    const user = await User.findById(payload.userId).select('-password');
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized: Invalid token' });
    }

    req.user = user; // Attach user to request
    next(); // Continue
  } catch (error) {
    console.error('isLogin middleware error:', error);
    return res.status(401).json({ status: 'error', message: 'Unauthorized: Invalid or expired token' });
  }
};

module.exports = {
  isLogin,
};
