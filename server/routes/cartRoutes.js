import express from 'express';
import { getCart, addToCart, updateCartItem, removeCartItem, clearCart } from '../controllers/cartController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All cart routes require auth

router.route('/').get(getCart).post(addToCart).delete(clearCart);
router.route('/:itemId').put(updateCartItem).delete(removeCartItem);

export default router;
