import jwt from 'jsonwebtoken';

// Use environment JWT_SECRET if present; otherwise fall back to a development default.
// Avoid throwing during module import to prevent crashes due to import ordering.
const JWT_SECRET = process.env.JWT_SECRET || (() => {
  console.warn('Warning: JWT_SECRET is not set. Using development fallback secret.');
  return 'dev-fallback-secret-change-in-prod';
})();


export const authMiddleware = (req, res, next) => {
  try {
    // Extract token from Authorization header (Bearer <token>)
    // const authHeader = req.headers.authorization || req.headers.Authorization;
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Attach user ID to request
    // req.userId = decoded.userId || decoded.id;
    // req.user = { id: req.userId };
    req.user = {
     id: decoded.userId || decoded.id
    };
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(401).json({ message: 'Authentication failed' });
  }
};
