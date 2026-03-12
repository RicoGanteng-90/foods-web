import {
  getAllFoodController,
  createFoodsController,
  updateFoodController,
  deleteFoodController,
} from '../controllers/foodsContoller.js';
import { Router } from 'express';

const router = Router();

router.get('/', getAllFoodController);

router.post('/add', createFoodsController);

router.put('/update/:id', updateFoodController);

router.delete('/delete/:id', deleteFoodController);

export default router;
