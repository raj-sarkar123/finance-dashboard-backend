const express = require('express');
const {
  getSummaryHandler,
  getCategoryBreakdownHandler,
  getTrendsHandler
} = require('./dashboard.controller');
const { checkAuth } = require('../../middleware/auth.middleware');
const { checkRole } = require('../../middleware/role.middleware');

const router = express.Router();

// Dashboard APIs are accessible by Admin and Analyst
router.use(checkAuth, checkRole(['admin', 'analyst']));

router.get('/summary', getSummaryHandler);
router.get('/categories', getCategoryBreakdownHandler);
router.get('/trends', getTrendsHandler);

module.exports = router;
