import express from 'express';
import {
    createOrder,
    getMyOrders,
    getOrder,
    updateOrderStatus,
    getAllOrders,
    getOrderStats,
} from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';

const router = express.Router();

router.use(protect); // All order routes require auth

router.post('/', createOrder);
router.get('/me', getMyOrders);
router.get('/stats', admin, getOrderStats);
router.get('/:id', getOrder);

// Admin
router.put('/:id', admin, updateOrderStatus);
router.get('/', admin, getAllOrders);

export default router;
