const dashboardService = require('./dashboard.service');
const { ApiResponse } = require('../../utils/apiResponse');
const tryCatch = require('../../utils/tryCatch');

const getSummaryHandler = tryCatch(async (req, res) => {
  const summary = await dashboardService.getSummary(req.query);
  res.status(200).json(new ApiResponse(200, summary, 'Dashboard summary fetched successfully'));
});

const getCategoryBreakdownHandler = tryCatch(async (req, res) => {
  const categories = await dashboardService.getCategoryBreakdown(req.query);
  res.status(200).json(new ApiResponse(200, categories, 'Category breakdown fetched successfully'));
});

const getTrendsHandler = tryCatch(async (req, res) => {
  const trends = await dashboardService.getTrends(req.query);
  res.status(200).json(new ApiResponse(200, trends, 'Trends fetched successfully'));
});

module.exports = {
  getSummaryHandler,
  getCategoryBreakdownHandler,
  getTrendsHandler,
};
