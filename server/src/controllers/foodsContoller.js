import { asyncHandler } from '../middleware/asyncHandler.js';
import Category from '../models/Category.js';
import Food from '../models/Food.js';
import fs from 'fs';
import path from 'path';

export const getAllFoodController = async (req, res, next) => {
  try {
    const foods = await Food.find();

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
  } catch (err) {
    next(err);
  }
};

export const createFoodsController = asyncHandler(async (req, res, next) => {
  const { name, description, price, category } = req.body;

  if (!name || !description || !price || !category) {
    if (req.file) {
      const pathToDelete = path.join('uploads', req.file.filename);

      if (fs.existsSync(pathToDelete)) fs.unlinkSync(pathToDelete);
    }

    return res.status(400).json({
      success: false,
      message: 'All fields are required',
    });
  }

  const categoryId = await Category.findById(category);

  if (!categoryId) {
    if (req.file) {
      const pathToDelete = path.join('uploads', req.file.filename);

      if (fs.existsSync(pathToDelete)) fs.unlinkSync(pathToDelete);
    }

    return res.status(404).json({
      success: false,
      messaage: 'categoryId not found, please provide a valid category ID',
    });
  }

  const result = await Food.create({
    name,
    description,
    image: req.file ? req.file.filename : undefined,
    price,
    category,
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

export const updateFoodController = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, description, price, category } = req.body;
  const newImage = req.file ? req.file.filename : undefined;

  const existingFood = await Food.findById(id);

  if (!existingFood) {
    if (newImage) {
      const pathToDelete = path.join('uploads', newImage);
      if (fs.existsSync(pathToDelete)) fs.unlinkSync(pathToDelete);
    }

    return res.status(404).json({ success: false, message: 'food not found' });
  }

  const updateData = { name, description, price, category };

  if (newImage) {
    updateData.image = newImage;

    if (existingFood.image) {
      const oldImagePath = path.join('uploads', existingFood.image);

      if (fs.existsSync(oldImagePath)) {
        try {
          fs.unlinkSync(oldImagePath);
        } catch (err) {
          next(err);
        }
      }
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
      try {
        fs.unlinkSync(pathToDelete);
      } catch (err) {
        next(err);
      }
    }
  }

  await Food.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: 'Food deleted successfully',
  });
});
