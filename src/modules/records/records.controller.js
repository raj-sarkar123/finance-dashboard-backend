const recordsService = require('./records.service');
const { createRecordSchema, updateRecordSchema } = require('./records.schema');
const { ApiResponse } = require('../../utils/apiResponse');
const tryCatch = require('../../utils/tryCatch');

const getAllRecordsHandler = tryCatch(async (req, res) => {
  const result = await recordsService.getAllRecords(req.query);
  res.status(200).json(new ApiResponse(200, result, 'Records fetched successfully'));
});

const createRecordHandler = tryCatch(async (req, res) => {
  const validatedData = createRecordSchema.parse(req.body);
  const createdBy = req.user.id;
  
  const record = await recordsService.createRecord(validatedData, createdBy);
  res.status(201).json(new ApiResponse(201, record, 'Record created successfully'));
});

const updateRecordHandler = tryCatch(async (req, res) => {
  const { id } = req.params;
  const validatedData = updateRecordSchema.parse(req.body);
  
  const updatedRecord = await recordsService.updateRecord(id, validatedData);
  res.status(200).json(new ApiResponse(200, updatedRecord, 'Record updated successfully'));
});

const deleteRecordHandler = tryCatch(async (req, res) => {
  const { id } = req.params;
  await recordsService.deleteRecord(id);
  res.status(200).json(new ApiResponse(200, { id }, 'Record deleted successfully'));
});

module.exports = {
  getAllRecordsHandler,
  createRecordHandler,
  updateRecordHandler,
  deleteRecordHandler,
};
