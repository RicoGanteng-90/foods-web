import {
  getAllFoodController,
  createFoodsController,
  updateFoodController,
  deleteFoodController,
} from '../controllers/foodsContoller.js';
import { Router } from 'express';
import upload from '../middleware/multerUpload.js';
import { authenticate, authorize } from '../middleware/authenticate.js';

const router = Router();

router.get('/', authenticate, authorize('admin'), getAllFoodController);

router.post('/add', upload.single('image'), createFoodsController);

router.put('/update/:id', upload.single('image'), updateFoodController);

router.delete('/delete/:id', deleteFoodController);

export default router;
