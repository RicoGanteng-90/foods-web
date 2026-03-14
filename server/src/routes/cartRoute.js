import { Router } from 'express';
import { getCartController } from '../controllers/cartController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.get('/', authenticate, getCartController);

export default router;
