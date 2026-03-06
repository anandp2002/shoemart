import express from 'express';
import {
    updateProfile,
    updateAvatar,
    updatePassword,
    addAddress,
    updateAddress,
    deleteAddress,
    toggleWishlist,
    getAllUsers,
    updateUserRole,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.use(protect); // All user routes require auth

router.put('/profile', updateProfile);
router.put('/avatar', upload.single('avatar'), updateAvatar);
router.put('/password', updatePassword);

// Addresses
router.post('/addresses', addAddress);
router.put('/addresses/:addressId', updateAddress);
router.delete('/addresses/:addressId', deleteAddress);

// Wishlist
router.put('/wishlist/:productId', toggleWishlist);

// Admin
router.get('/', admin, getAllUsers);
router.put('/:id/role', admin, updateUserRole);

export default router;
