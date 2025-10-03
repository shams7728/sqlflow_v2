const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  // Get token from header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  // Also check x-user-id header for guest users
  const userId = req.headers['x-user-id'];
  
  // Allow guest users
  if (userId === 'guest' && !token) {
    req.user = { userId: 'guest', isGuest: true };
    return next();
  }
  
  // If no token, return error
  if (!token) {
    return res.status(401).json({ success: false, error: 'Access token required' });
  }
  
  // Verify token
  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, error: 'Invalid or expired token' });
    }
    
    req.user = user;
    next();
  });
};

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  const userId = req.headers['x-user-id'];
  
  if (userId === 'guest' || !token) {
    req.user = { userId: userId || 'guest', isGuest: true };
    return next();
  }
  
  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      req.user = { userId: 'guest', isGuest: true };
    } else {
      req.user = user;
    }
    next();
  });
};

module.exports = {
  authenticateToken,
  optionalAuth
};
