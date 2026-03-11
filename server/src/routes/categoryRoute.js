import { createCategoryController } from '../controllers/categoryController.js';
import { Router } from 'express';

const router = Router();

router.post('/add', createCategoryController);

export default router;
