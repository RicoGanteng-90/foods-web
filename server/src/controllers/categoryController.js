import Category from '../models/Category.js';

export const getAllCategoriesController = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: 'Categories retrieved successfully',
      result: categories,
    });
  } catch (err) {
    next(err);
  }
};

export const createCategoryController = async (req, res, next) => {
  const { name, description } = req.body;
  if (!name) {
    return res.status(400).json({
      success: false,
      message: 'Category name is required',
    });
  }

  try {
    const result = await Category.create({
      name,
      description,
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      result: result,
    });
  } catch (err) {
    next(err);
  }
};

export const updateCategoryController = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({
      success: false,
      message: 'Category name is required',
    });
  }

  try {
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
  } catch (err) {
    next(err);
  }
};

export const deleteCategoryController = async (req, res, next) => {
  const { id } = req.params;

  try {
    const category = await Category.findByIdAndUpdate(
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
  } catch (err) {
    next(err);
  }
};
