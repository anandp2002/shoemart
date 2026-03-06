import asyncHandler from 'express-async-handler';
import cartService from '../services/cartService.js';

// @desc    Get user cart
// @route   GET /api/v1/cart
export const getCart = asyncHandler(async (req, res) => {
    const cart = await cartService.getCart(req.user._id);
    res.json({ success: true, cart });
});

// @desc    Add item to cart
// @route   POST /api/v1/cart
export const addToCart = asyncHandler(async (req, res) => {
    const cart = await cartService.addToCart(req.user._id, req.body);
    res.status(201).json({ success: true, cart });
});

// @desc    Update cart item quantity
// @route   PUT /api/v1/cart/:itemId
export const updateCartItem = asyncHandler(async (req, res) => {
    const cart = await cartService.updateCartItem(
        req.user._id,
        req.params.itemId,
        req.body.quantity
    );
    res.json({ success: true, cart });
});

// @desc    Remove item from cart
// @route   DELETE /api/v1/cart/:itemId
export const removeCartItem = asyncHandler(async (req, res) => {
    const cart = await cartService.removeCartItem(req.user._id, req.params.itemId);
    res.json({ success: true, cart });
});

// @desc    Clear cart
// @route   DELETE /api/v1/cart
export const clearCart = asyncHandler(async (req, res) => {
    const cart = await cartService.clearCart(req.user._id);
    res.json({ success: true, cart });
});
