import Category from '../models/Category.js';

export const createCategoryController = async (req, res) => {
  const { name, description, imgUrl } = req.body;

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
      imgUrl,
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
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
