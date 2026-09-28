const CategoryModel = require('../models/CategoryModel');
const AppError = require('../utils/AppError');
const { sendSuccess, sendCreated } = require('../utils/response');
const catchAsync = require('../utils/catchAsync');

/**
 * GET /api/categories
 */
const getCategories = catchAsync(async (req, res) => {
  let categories;
  if (req.query.type) {
    categories = await CategoryModel.findByType(req.user.id, req.query.type);
  } else {
    categories = await CategoryModel.findByUserId(req.user.id);
  }
  sendSuccess(res, { categories });
});

/**
 * GET /api/categories/:id
 */
const getCategory = catchAsync(async (req, res) => {
  const category = await CategoryModel.findById(req.params.id, req.user.id);
  if (!category) {
    throw AppError.notFound('Category not found');
  }
  sendSuccess(res, { category });
});

/**
 * POST /api/categories
 */
const createCategory = catchAsync(async (req, res) => {
  const { name, type, icon } = req.body;

  const category = await CategoryModel.create({
    user_id: req.user.id,
    name,
    type,
    icon: icon || '📦',
  });

  sendCreated(res, { category }, 'Category created successfully');
});

/**
 * PUT /api/categories/:id
 */
const updateCategory = catchAsync(async (req, res) => {
  // Only allow updating user-created categories (not default ones)
  const existing = await CategoryModel.findById(req.params.id, req.user.id);
  if (!existing) {
    throw AppError.notFound('Category not found');
  }
  if (!existing.user_id) {
    throw AppError.forbidden('Default categories cannot be modified');
  }

  const category = await CategoryModel.update(req.params.id, req.user.id, req.body);
  sendSuccess(res, { category }, 'Category updated successfully');
});

/**
 * DELETE /api/categories/:id
 */
const deleteCategory = catchAsync(async (req, res) => {
  const existing = await CategoryModel.findById(req.params.id, req.user.id);
  if (!existing) {
    throw AppError.notFound('Category not found');
  }
  if (!existing.user_id) {
    throw AppError.forbidden('Default categories cannot be deleted');
  }

  await CategoryModel.delete(req.params.id, req.user.id);
  sendSuccess(res, null, 'Category deleted successfully');
});

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
