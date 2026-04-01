const { ApiError } = require('./apiResponse');

const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;

  if (!statusCode) {
    statusCode = 500;
    message = 'Internal Server Error';
  }

  // Handle Supabase/Zod errors safely
  if (err.name === 'ZodError') {
    statusCode = 400;
    message = 'Validation Error';
    err.errors = err.issues.map((i) => ({ field: i.path.join('.'), message: i.message }));
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || null,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

module.exports = errorHandler;
