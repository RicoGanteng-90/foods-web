import { Router } from 'express';
import {
  addToCartController,
  getCartController,
  removeFromCartController,
  updateCartController,
} from '../controllers/cartController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.get('/', authenticate, getCartController);

router.post('/add-cart', authenticate, addToCartController);

router.put('/update-cart/:foodId', authenticate, updateCartController);

router.delete('/delete-cart/:foodId', authenticate, removeFromCartController);

export default router;
