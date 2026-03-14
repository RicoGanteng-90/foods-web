import Cart from '../models/Cart.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import Food from '../models/Food.js';
import { type } from 'os';

export const getCartController = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id }).populate(
    'items.food',
    'name price image'
  );

  if (!cart) {
    return res.status(404).json({ message: 'Cart not found' });
  }
  res.status(200).json(cart);
});

export const addToCartController = asyncHandler(async (req, res) => {
  const { food, quantity } = req.body;

  if (!food || !quantity || quantity < 1) {
    return res
      .status(400)
      .json({ success: false, message: 'Food and quantity are required' });
  }

  const foodExist = await Food.findById(food);

  if (!foodExist) {
    return res
      .status(404)
      .json({ success: false, message: 'Food unavailable' });
  }

  let cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    cart = new Cart({ user: req.user.id, items: [] });
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.food.toString() === food
  );

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += quantity;
  } else {
    cart.items.push({ food, quantity });
  }

  await cart.save();

  const populatedCart = await cart.populate('items.food', 'name price image');

  res.status(200).json({
    success: true,
    message: 'Cart updated successfully',
    result: populatedCart,
  });
});

export const updateCartController = asyncHandler(async (req, res) => {
  const { quantity } = req.body;

  if (typeof quantity === 'undefined') {
    return res
      .status(400)
      .json({ success: false, message: 'Quantity required' });
  }

  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return res.status(404).json({ success: false, message: 'Cart not found' });
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.food.toString() === req.params.foodId
  );

  if (itemIndex === -1) {
    return res.status(404).json({ success: false, message: 'Item  not found' });
  }

  if (quantity < 1) {
    cart.items.splice(itemIndex, 1);
  } else {
    cart.items[itemIndex].quantity = quantity;
  }

  if (cart.items.length === 0) {
    await cart.deleteOne();
    return res
      .status(200)
      .json({ success: true, message: 'Cart deleted as it was empty' });
  }

  await cart.save();

  const populatedCart = await cart.populate('items.food', 'name price image');

  res.status(200).json({
    success: true,
    message: 'Cart updated successfully',
    result: populatedCart,
  });
});

export const removeFromCartController = asyncHandler(async (req, res) => {
  const { foodId } = req.params;

  if (!food) {
    return res
      .status(400)
      .json({ success: false, message: 'Food id is required' });
  }

  let cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return res.status(404).json({ message: 'Cart not found' });
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.food.toString() === food
  );

  if (itemIndex < 0) {
    return res.status(404).json({ success: false, message: 'Item not found' });
  }

  cart.items.splice(itemIndex, 1);

  if (cart.items.length === 0) {
    await cart.deleteOne();
    return res
      .status(200)
      .json({ success: true, message: 'Cart deleted as it was empty' });
  }

  await cart.save();

  res
    .status(200)
    .json({ success: true, message: 'Cart item deleted', result: cart });
});
