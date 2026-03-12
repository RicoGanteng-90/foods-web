import {
  getAllFoodController,
  createFoodsController,
  updateFoodController,
  deleteFoodController,
} from '../controllers/foodsContoller.js';
import { Router } from 'express';
import upload from '../middleware/multerUpload.js';

const router = Router();

router.get('/', getAllFoodController);

router.post('/add', upload.single('image'), createFoodsController);

router.put('/update/:id', upload.single('image'), updateFoodController);

router.delete('/delete/:id', deleteFoodController);

export default router;
