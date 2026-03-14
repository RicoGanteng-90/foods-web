import { asyncHandler } from '../middleware/asyncHandler.js';
import Category from '../models/Category.js';
import Food from '../models/Food.js';
import fs from 'fs';
import path from 'path';

export const getAllFoodController = asyncHandler(async (req, res) => {
  const { search, category } = req.query;

  const filter = {};

  if (search) {
    filter.name = { $regex: search, $options: 'i' };
  }

  if (category) {
    filter.category = category;
  }

  const foods = await Food.find(filter);

  if (foods.length === 0) {
    return res.status(200).json({
      success: false,
      message: 'there are no foods yet',
      result: [],
    });
  }

  res.status(200).json({
    success: true,
    message: 'Enjoy your foods',
    total: foods.length,
    result: foods,
  });
});

export const createFoodsController = asyncHandler(async (req, res, next) => {
  const { name, description, price, category, stock } = req.body;

  const deleteFile = () => {
    if (req.file) {
      const pathToDelete = path.join('uploads', req.file.filename);
      if (fs.existsSync(pathToDelete)) fs.unlinkSync(pathToDelete);
    }
  };

  if (!name || !description || !price || !category || stock === undefined) {
    deleteFile();

    return res.status(400).json({
      success: false,
      message: 'All fields are required',
    });
  }

  const existingName = await Food.findOne({ name: name });

  if (existingName) {
    deleteFile();
    return res
      .status(409)
      .json({ success: false, message: 'Food name already exist' });
  }

  const categoryId = await Category.findById(category);

  if (!categoryId) {
    deleteFile();

    return res.status(404).json({
      success: false,
      message: 'categoryId not found, please provide a valid category ID',
    });
  }

  const result = await Food.create({
    name,
    description,
    image: req.file ? req.file.filename : undefined,
    price,
    category,
    stock,
  });

  if (!result) {
    throw new Error('Input failed');
  }

  res.status(200).json({
    success: true,
    message: 'Foods created successfully',
    result: result,
  });
});

export const updateFoodController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category, stock } = req.body;

  const newImage = req.file ? req.file.filename : undefined;

  const deleteFile = () => {
    if (req.file) {
      const pathToDelete = path.join('uploads', req.file.filename);
      if (fs.existsSync(pathToDelete)) fs.unlinkSync(pathToDelete);
    }
  };

  if (category) {
    const categoryExist = await Category.findById(category);

    if (!categoryExist) {
      deleteFile();

      return res.status(404).json({
        success: false,
        message: 'categoryId not found, please provide a valid category ID',
      });
    }
  }

  const existingFood = await Food.findById(id);

  if (!existingFood) {
    deleteFile();

    return res.status(404).json({ success: false, message: 'food not found' });
  }

  const updateData = {
    name,
    description,
    price,
    category,
    stock,
    ...(newImage && { image: newImage }),
  };

  if (newImage && existingFood.image) {
    const oldImagePath = path.join('uploads', existingFood.image);

    if (fs.existsSync(oldImagePath)) {
      fs.unlinkSync(oldImagePath);
    }
  }

  const food = await Food.findByIdAndUpdate(id, updateData, {
    returnDocument: 'after',
    runValidators: true,
  });

  if (!food) {
    return res.status(404).json({ success: false, message: 'food not found' });
  }

  res.status(200).json({
    success: true,
    message: 'Food updated successfully',
    result: food,
  });
});

export const deleteFoodController = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const food = await Food.findById(id);

  if (!food) {
    return res.status(404).json({ success: false, message: 'food not found' });
  }

  if (food.image) {
    const pathToDelete = path.join('uploads', food.image);

    if (fs.existsSync(pathToDelete)) {
      fs.unlinkSync(pathToDelete);
    }
  }

  await food.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Food and associated image deleted successfully',
  });
});
