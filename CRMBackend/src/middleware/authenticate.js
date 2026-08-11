const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_crm_key_123';

module.exports = (req, res, next) => {
  const authHeader = req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const targetId = decoded.workspaceId || decoded.tenantId || decoded.workspace;
    const userId = decoded.userId || decoded._id;
    
    const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(String(id));
    
    if (!targetId || !userId || !isValidObjectId(targetId) || !isValidObjectId(userId)) {
      return res.status(401).json({ error: 'Token is outdated or invalid. Please click Log Out (or clear LocalStorage) and log back in.' });
    }
    
    decoded.userId = userId;
    decoded.workspaceId = targetId;
    
    req.user = decoded;
    
    next();
  } catch (error) {
    console.error("DEBUG: Authentication Error - ", error.message);
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
};