import { Router } from 'express';
import {
  loginUser,
  logoutUser,
  registerUser,
} from '../controllers/authController.js';
const router = Router();

router.post('/register-user', registerUser);

router.post('/login-user', loginUser);

router.post('/logout-user', logoutUser);

export default router;
