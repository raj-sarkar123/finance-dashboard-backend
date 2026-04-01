const jwt = require('jsonwebtoken');
const { ApiError } = require('../utils/apiResponse');
const tryCatch = require('../utils/tryCatch');
const supabase = require('../config/supabaseClient');

const checkAuth = tryCatch(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'Unauthorized: No token provided');
  }

  const token = authHeader.split(' ')[1];

  if (!process.env.JWT_SECRET) {
    throw new ApiError(500, 'Internal Server Error: Missing JWT Secret');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user still exists/active (optional but recommended for security)
    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, role, is_active')
      .eq('id', decoded.id)
      .single();

    if (error || !user) {
      throw new ApiError(401, 'Unauthorized: Invalid user');
    }

    if (!user.is_active) {
      throw new ApiError(403, 'Forbidden: User is deactivated');
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new ApiError(401, 'Unauthorized: Token expired');
    }
    throw new ApiError(401, 'Unauthorized: Invalid token');
  }
});

module.exports = { checkAuth };
