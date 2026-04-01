const supabase = require('../../config/supabaseClient');
const { ApiError } = require('../../utils/apiResponse');

const getSummary = async (queryFilters) => {
  const { startDate, endDate } = queryFilters;
  
  let query = supabase.from('financial_records').select('amount, type');
  
  if (startDate) query = query.gte('date', startDate);
  if (endDate) query = query.lte('date', endDate);

  const { data, error } = await query;

  if (error) {
    throw new ApiError(500, 'Error fetching summary', [error]);
  }

  let totalIncome = 0;
  let totalExpense = 0;

  data.forEach(record => {
    if (record.type === 'income') {
      totalIncome += parseFloat(record.amount);
    } else {
      totalExpense += parseFloat(record.amount);
    }
  });

  return {
    totalIncome,
    totalExpense,
    netBalance: totalIncome - totalExpense
  };
};

const getCategoryBreakdown = async (queryFilters) => {
  const { startDate, endDate, type } = queryFilters;
  
  let query = supabase.from('financial_records').select('amount, type, category');
  
  if (startDate) query = query.gte('date', startDate);
  if (endDate) query = query.lte('date', endDate);
  if (type) query = query.eq('type', type);

  const { data, error } = await query;

  if (error) {
    throw new ApiError(500, 'Error fetching category breakdown', [error]);
  }

  const categoryTotals = {};

  data.forEach(record => {
    if (!categoryTotals[record.category]) {
      categoryTotals[record.category] = 0;
    }
    categoryTotals[record.category] += parseFloat(record.amount);
  });

  return Object.keys(categoryTotals).map(category => ({
    category,
    total: categoryTotals[category]
  })).sort((a, b) => b.total - a.total);
};

const getTrends = async (queryFilters) => {
  const { startDate, endDate } = queryFilters;
  
  let query = supabase.from('financial_records').select('amount, type, date');
  
  if (startDate) query = query.gte('date', startDate);
  if (endDate) query = query.lte('date', endDate);

  const { data, error } = await query;

  if (error) {
    throw new ApiError(500, 'Error fetching trends', [error]);
  }

  const monthlyData = {};

  data.forEach(record => {
    // Extract YYYY-MM
    const month = record.date.substring(0, 7);
    
    if (!monthlyData[month]) {
      monthlyData[month] = { income: 0, expense: 0, month };
    }
    
    if (record.type === 'income') {
      monthlyData[month].income += parseFloat(record.amount);
    } else {
      monthlyData[month].expense += parseFloat(record.amount);
    }
  });

  return Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));
};

module.exports = {
  getSummary,
  getCategoryBreakdown,
  getTrends,
};
