import User from '../models/User.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const getAllUser = asyncHandler(async (req, res) => {
  const user = await User.find();

  if (user.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Users not found',
    });
  }

  res.status(200).json({
    success: 200,
    message: 'Users found',
    result: user,
  });
});

export const userUpdateController = asyncHandler(async (req, res) => {
  const { name, address } = req.body;

  const updateField = {};

  if (name) updateField.name = name;

  if (address) {
    const allowedAddressFields = ['street', 'city', 'province', 'country'];
    const InvalidKeys = Object.keys(address).filter(
      (key) => !allowedAddressFields.includes(key)
    );

    if (InvalidKeys.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: `Invalid ${InvalidKeys.join(', ')}` });
    }

    Object.keys(address).forEach((key) => {
      updateField[`address.${key}`] = address[key];
    });
  }

  if (Object.keys(updateField).length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No fields to update',
    });
  }

  const user = await User.findByIdAndUpdate(req.user.id, updateField, {
    returnDocument: 'after',
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    result: user,
  });
});
export const userDeleteController = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.user.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
  });
});
