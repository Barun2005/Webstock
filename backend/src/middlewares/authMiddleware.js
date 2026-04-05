const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
  let token;

  // The client must send "Authorization: Bearer <token>"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }

  try {
    // Cryptographically verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_fallback');
    
    // Once verified, we can attach the user's ID to the request object directly
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token is invalid or expired' });
  }
};
