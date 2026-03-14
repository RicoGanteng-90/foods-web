import { asyncHandler } from '../middleware/asyncHandler.js';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import mongoose from 'mongoose';
import Food from '../models/Food.js';

export const getMyOrder = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user.id })
    .populate('user', 'name email')
    .populate('orderItems.food', 'name image price');

  if (!orders || orders.length === 0) {
    return res.status(200).json({
      success: true,
      message: `You don't have any order history`,
      result: [],
    });
  }

  res.status(200).json({
    success: true,
    message: 'Orders found',
    result: orders,
  });
});

export const inputOrdersController = asyncHandler(async (req, res) => {
  const { deliveryAddress, paymentMethod, note } = req.body;

  if (!deliveryAddress || !paymentMethod) {
    return res.status(400).json({
      success: false,
      message: 'Delivery address and payment method are required',
    });
  }

  const cart = await Cart.findOne({ user: req.user.id }).populate(
    'items.food',
    'name price stock'
  );

  if (!cart || cart.items.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Cart is empty, please choose the menu first',
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    for (const item of cart.items) {
      const updated = await Food.findOneAndUpdate(
        { _id: item.food._id, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { session }
      );

      if (!updated) {
        await session.abortTransaction();
        return res.status(400).json({
          success: false,
          message: `${item.food.name} is out of stock or has insufficient quantity`,
        });
      }
    }

    const total = cart.items.reduce(
      (sum, item) => sum + item.food.price * item.quantity,
      0
    );

    const orderItems = cart.items.map((item) => ({
      food: item.food._id,
      name: item.food.name,
      price: item.food.price,
      quantity: item.quantity,
    }));

    const order = new Order({
      user: req.user.id,
      orderItems,
      note,
      deliveryAddress,
      total,
      paymentMethod,
    });

    await order.save({ session });

    await cart.deleteOne({ session });

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: 'Order created succesfully',
      result: order,
    });
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
});

export const cancelOrderController = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId);

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  const isAdmin = req.user.role === 'admin';
  const isOwner = order.user.toString() === 'req.user.id';

  if (!isOwner && !isAdmin) {
    return res.status(403).json({ success: false, message: 'Unauthorized' });
  }

  if (!isAdmin && order.status !== 'Pending') {
    return res.status(400).json({
      success: false,
      message: `Order cannot be cancelled at status: ${order.status}`,
    });
  }

  if (order.status === 'Cancelled') {
    return res
      .status(400)
      .json({ success: false, message: 'Order is already cancelled' });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    for (const item of order.orderItems) {
      await Food.findOneAndUpdate(
        { _id: item.food._id },
        { $inc: { stock: +item.quantity } },
        { session }
      );
    }

    order.status = 'Cancelled';
    await order.save({ session });

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      result: order,
    });
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    await session.endSession();
  }
});
