import express from 'express';
import {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getFeaturedProducts,
    getCategories,
    createCategory,
    getBrands,
} from '../controllers/productController.js';
import { protect } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/featured', getFeaturedProducts);
router.get('/categories', getCategories);
router.get('/brands', getBrands);
router.get('/', getProducts);
router.get('/:id', getProduct);

// Admin routes
router.post('/', protect, admin, upload.array('images', 5), createProduct);
router.put('/:id', protect, admin, upload.array('images', 5), updateProduct);
router.delete('/:id', protect, admin, deleteProduct);
router.post('/categories', protect, admin, upload.single('image'), createCategory);

export default router;
