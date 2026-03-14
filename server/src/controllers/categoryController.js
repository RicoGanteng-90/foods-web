import { asyncHandler } from '../middleware/asyncHandler.js';
import Category from '../models/Category.js';

export const getAllCategoriesController = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    message: 'Categories retrieved successfully',
    result: categories,
  });
});

export const createCategoryController = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({
      success: false,
      message: 'Category name is required',
    });
  }

  const result = await Category.create({
    name,
    description,
  });

  res.status(201).json({
    success: true,
    message: 'Category created successfully',
    result: result,
  });
});

export const updateCategoryController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({
      success: false,
      message: 'Category name is required',
    });
  }

  const category = await Category.findByIdAndUpdate(
    id,
    { name, description },
    { returnDocument: 'after' }
  );

  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Category not found',
    });
  }

  res.status(200).json({
    success: true,
    message: 'Category updated successfully',
    result: category,
  });
});

export const deleteCategoryController = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await Category.findByIdAndDelete(
    id,
    { isDeleted: true },
    { returnDocument: 'after' }
  );

  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Category not found',
    });
  }

  res.status(200).json({
    success: true,
    message: 'Category deleted successfully',
    result: category,
  });
});
