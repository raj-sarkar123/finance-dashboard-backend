const { ApiError } = require('../utils/apiResponse');

const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Unauthorized: Please authenticate first'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, 'Forbidden: You do not have permission to perform this action'));
    }

    next();
  };
};

module.exports = { checkRole };
