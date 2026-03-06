import asyncHandler from 'express-async-handler';
import userService from '../services/userService.js';

// @desc    Update user profile
// @route   PUT /api/v1/users/profile
export const updateProfile = asyncHandler(async (req, res) => {
    const user = await userService.updateProfile(req.user._id, req.body);
    res.json({ success: true, user });
});

// @desc    Update avatar
// @route   PUT /api/v1/users/avatar
export const updateAvatar = asyncHandler(async (req, res) => {
    if (!req.file) {
        res.status(400);
        throw new Error('Please upload an image');
    }
    const user = await userService.updateAvatar(req.user._id, req.file);
    res.json({ success: true, user });
});

// @desc    Update password
// @route   PUT /api/v1/users/password
export const updatePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    await userService.updatePassword(req.user._id, currentPassword, newPassword);
    res.json({ success: true, message: 'Password updated successfully' });
});

// @desc    Add address
// @route   POST /api/v1/users/addresses
export const addAddress = asyncHandler(async (req, res) => {
    const addresses = await userService.addAddress(req.user._id, req.body);
    res.status(201).json({ success: true, addresses });
});

// @desc    Update address
// @route   PUT /api/v1/users/addresses/:addressId
export const updateAddress = asyncHandler(async (req, res) => {
    const addresses = await userService.updateAddress(
        req.user._id,
        req.params.addressId,
        req.body
    );
    res.json({ success: true, addresses });
});

// @desc    Delete address
// @route   DELETE /api/v1/users/addresses/:addressId
export const deleteAddress = asyncHandler(async (req, res) => {
    const addresses = await userService.deleteAddress(req.user._id, req.params.addressId);
    res.json({ success: true, addresses });
});

// @desc    Toggle wishlist
// @route   PUT /api/v1/users/wishlist/:productId
export const toggleWishlist = asyncHandler(async (req, res) => {
    const wishlist = await userService.toggleWishlist(req.user._id, req.params.productId);
    res.json({ success: true, wishlist });
});

// @desc    Get all users (Admin)
// @route   GET /api/v1/users
export const getAllUsers = asyncHandler(async (req, res) => {
    const result = await userService.getAllUsers(req.query.page, req.query.limit);
    res.json({ success: true, ...result });
});

// @desc    Update user role (Admin)
// @route   PUT /api/v1/users/:id/role
export const updateUserRole = asyncHandler(async (req, res) => {
    const user = await userService.updateUserRole(req.params.id, req.body.role);
    res.json({ success: true, user });
});
