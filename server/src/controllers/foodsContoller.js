import { asyncHandler } from '../middleware/asyncHandler.js';
import Food from '../models/Food.js';

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

export const createFoodsController = async (req, res) => {
  const { name, description, price, category } = req.body;

  if (!name || !description || !price || !category) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required',
    });
  }

  try {
    const result = await Food.create({
      name,
      description,
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
  } catch (err) {
    next(err);
  }
};

export const updateFoodController = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { name, description, price, category } = req.body;

  const food = await Food.findByIdAndUpdate(
    id,
    { name, description, price, category },
    { returnDocument: 'after' }
  );

  if (!food) {
    return res.status(404).json({ success: false, message: 'food not found' });
  }

  res.status(200).json({
    success: true,
    message: 'Food updated successfully',
  });
});

export const deleteFoodController = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const food = Food.findByIdAndDelete(id);

  if (!food) {
    return res.status(404).json({ success: false, message: 'food not found' });
  }

  res.status(200).json({
    success: true,
    message: 'Food deleted successfully',
  });
});
