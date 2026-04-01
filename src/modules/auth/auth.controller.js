const authService = require('./auth.service');
const { registerSchema, loginSchema } = require('./auth.schema');
const { ApiResponse } = require('../../utils/apiResponse');
const tryCatch = require('../../utils/tryCatch');

const registerHandler = tryCatch(async (req, res) => {
  // Validate request body
  const validatedData = registerSchema.parse(req.body);

  // Call service layer
  const user = await authService.register(validatedData);

  res.status(201).json(new ApiResponse(201, user, 'User registered successfully'));
});

const loginHandler = tryCatch(async (req, res) => {
  // Validate request body
  const validatedData = loginSchema.parse(req.body);

  // Call service layer
  const data = await authService.login(validatedData);

  res.status(200).json(new ApiResponse(200, data, 'Login successful'));
});

module.exports = {
  registerHandler,
  loginHandler,
};
