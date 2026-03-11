import Food from '../models/Food.js';

export const getAllFoodController = async (req, res) => {
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
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to display foods',
    });
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
    console.error(err.message);
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
