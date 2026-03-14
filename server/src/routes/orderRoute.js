import { getMyOrder } from '../controllers/orderContoller.js';
import { Router } from 'express';

const router = Router();

router.get('/', getMyOrder);

export default router;
