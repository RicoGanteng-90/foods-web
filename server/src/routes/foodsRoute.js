import {
  getAllFoodController,
  createFoodsController,
} from '../controllers/foodsContoller.js';
import { Router } from 'express';

const router = Router();

router.get('/', getAllFoodController);

router.post('/add', createFoodsController);

export default router;
