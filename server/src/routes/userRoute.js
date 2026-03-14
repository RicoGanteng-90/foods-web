import { Router } from 'express';
import {
  getAllUser,
  userUpdateController,
} from '../controllers/userController.js';
import { authenticate, authorize } from '../middleware/authenticate.js';

const router = Router();

router.get('/', authorize('admin'), getAllUser);

router.put(
  '/update-user',
  authenticate,
  authorize('customer'),
  userUpdateController
);

export default router;
