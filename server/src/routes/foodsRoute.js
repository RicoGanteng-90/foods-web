import { getAllFoodController } from '../controllers/foodsContoller.js';
import { Router } from 'express';

const router = Router();

router.get('/', getAllFoodController);

export default router;
