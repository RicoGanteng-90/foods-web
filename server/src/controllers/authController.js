import User from '../models/User.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { generateToken } from '../utils/jwt.js';

export const registerUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required',
    });
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User already exists',
    });
  }

  const user = await User.create({
    email,
    password,
  });

  if (!user) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create user',
    });
  }

  res.status(201).json({
    success: true,
    message: 'Register successful',
    result: user,
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required',
    });
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
    });
  }

  const token = generateToken(user);

  res.cookie('token', token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    message: 'Login successful',
    result: {
      id: user._id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
});

export const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  res.status(200).json({
    success: true,
    message: 'Logout successful',
  });
});
