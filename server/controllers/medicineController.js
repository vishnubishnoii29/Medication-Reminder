const Medicine = require('../models/Medicine');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createMedicine = catchAsync(async (req, res, next) => {
  req.body.user = req.user.id;
  
  const newMedicine = await Medicine.create(req.body);

  res.status(201).json({
    status: 'success',
    data: newMedicine
  });
});

exports.getAllMedicines = catchAsync(async (req, res, next) => {
  // Advanced filtering can be added here
  const queryObj = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach(el => delete queryObj[el]);

  // Find medicines belonging to current user
  queryObj.user = req.user.id;

  let query = Medicine.find(queryObj);

  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 100;
  const skip = (page - 1) * limit;
  query = query.skip(skip).limit(limit);

  const medicines = await query;

  res.status(200).json({
    status: 'success',
    results: medicines.length,
    data: medicines
  });
});

exports.getMedicine = catchAsync(async (req, res, next) => {
  const medicine = await Medicine.findOne({ _id: req.params.id, user: req.user.id });

  if (!medicine) {
    return next(new AppError('No medicine found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: medicine
  });
});

exports.updateMedicine = catchAsync(async (req, res, next) => {
  const medicine = await Medicine.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!medicine) {
    return next(new AppError('No medicine found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: medicine
  });
});

exports.deleteMedicine = catchAsync(async (req, res, next) => {
  const medicine = await Medicine.findOneAndDelete({ _id: req.params.id, user: req.user.id });

  if (!medicine) {
    return next(new AppError('No medicine found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});
