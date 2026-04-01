const usersService = require('./users.service');
const { createUserSchema, updateUserSchema } = require('./users.schema');
const { ApiResponse } = require('../../utils/apiResponse');
const tryCatch = require('../../utils/tryCatch');

const getAllUsersHandler = tryCatch(async (req, res) => {
  const users = await usersService.getAllUsers();
  res.status(200).json(new ApiResponse(200, users, 'Users fetched successfully'));
});

const createUserHandler = tryCatch(async (req, res) => {
  const validatedData = createUserSchema.parse(req.body);
  const user = await usersService.createUser(validatedData, req.user);
  res.status(201).json(new ApiResponse(201, user, 'User created successfully'));
});

const updateUserHandler = tryCatch(async (req, res) => {
  const { id } = req.params;
  const validatedData = updateUserSchema.parse(req.body);
  
  const updatedUser = await usersService.updateUser(id, validatedData);
  res.status(200).json(new ApiResponse(200, updatedUser, 'User updated successfully'));
});

module.exports = {
  getAllUsersHandler,
  createUserHandler,
  updateUserHandler,
};
