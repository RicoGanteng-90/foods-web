import {
  createCategoryController,
  getAllCategoriesController,
} from '../controllers/categoryController.js';
import { Router } from 'express';

const router = Router();

router.get('/', getAllCategoriesController);

router.post('/add', createCategoryController);

export default router;
