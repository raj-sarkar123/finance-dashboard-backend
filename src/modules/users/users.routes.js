const express = require('express');
const { getAllUsersHandler, createUserHandler, updateUserHandler } = require('./users.controller');
const { checkAuth } = require('../../middleware/auth.middleware');
const { checkRole } = require('../../middleware/role.middleware');

const router = express.Router();

// All user routes require authentication and 'admin' role
router.use(checkAuth, checkRole(['admin']));

router.get('/', getAllUsersHandler);
router.post('/', createUserHandler);
router.patch('/:id', updateUserHandler);

module.exports = router;
