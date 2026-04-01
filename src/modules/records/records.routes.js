const express = require('express');
const { 
  getAllRecordsHandler, 
  createRecordHandler, 
  updateRecordHandler, 
  deleteRecordHandler 
} = require('./records.controller');
const { checkAuth } = require('../../middleware/auth.middleware');
const { checkRole } = require('../../middleware/role.middleware');

const router = express.Router();

// All records routes require authentication
router.use(checkAuth);

// GET accessible by all roles (viewer, analyst, admin)
router.get('/', getAllRecordsHandler);

// POST, PATCH, DELETE only accessible by admin
router.post('/', checkRole(['admin']), createRecordHandler);
router.patch('/:id', checkRole(['admin']), updateRecordHandler);
router.delete('/:id', checkRole(['admin']), deleteRecordHandler);

module.exports = router;
