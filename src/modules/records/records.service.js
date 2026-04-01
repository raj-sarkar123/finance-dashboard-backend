const supabase = require('../../config/supabaseClient');
const { ApiError } = require('../../utils/apiResponse');

const getAllRecords = async (queryFilters) => {
  const { type, category, startDate, endDate, page = 1, limit = 10 } = queryFilters;
  
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase.from('financial_records').select('*', { count: 'exact' });

  if (type) query = query.eq('type', type);
  if (category) query = query.eq('category', category);
  if (startDate) query = query.gte('date', startDate);
  if (endDate) query = query.lte('date', endDate);

  const { data, error, count } = await query
    .order('date', { ascending: false })
    .range(from, to);

  if (error) {
    throw new ApiError(500, 'Error fetching records', [error]);
  }

  return {
    records: data,
    pagination: {
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / limit)
    }
  };
};

const createRecord = async (recordData, createdBy) => {
  const { data, error } = await supabase
    .from('financial_records')
    .insert([{ ...recordData, created_by: createdBy }])
    .select()
    .single();

  if (error) {
    throw new ApiError(500, 'Error creating record', [error]);
  }

  return data;
};

const updateRecord = async (id, updateData) => {
  const { data, error } = await supabase
    .from('financial_records')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new ApiError(500, 'Error updating record', [error]);
  }

  if (!data) {
    throw new ApiError(404, 'Record not found');
  }

  return data;
};

const deleteRecord = async (id) => {
  const { error } = await supabase
    .from('financial_records')
    .delete()
    .eq('id', id);

  if (error) {
    throw new ApiError(500, 'Error deleting record', [error]);
  }

  return { id };
};

module.exports = {
  getAllRecords,
  createRecord,
  updateRecord,
  deleteRecord,
};
