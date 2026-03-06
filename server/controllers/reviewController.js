import asyncHandler from 'express-async-handler';
import reviewService from '../services/reviewService.js';

// @desc    Create review
// @route   POST /api/v1/reviews/:productId
export const createReview = asyncHandler(async (req, res) => {
    const review = await reviewService.createReview(
        req.user._id,
        req.params.productId,
        req.body
    );
    res.status(201).json({ success: true, review });
});

// @desc    Get product reviews
// @route   GET /api/v1/reviews/:productId
export const getProductReviews = asyncHandler(async (req, res) => {
    const result = await reviewService.getProductReviews(
        req.params.productId,
        req.query.page,
        req.query.limit
    );
    res.json({ success: true, ...result });
});

// @desc    Delete review
// @route   DELETE /api/v1/reviews/:id
export const deleteReview = asyncHandler(async (req, res) => {
    const isAdmin = req.user.role === 'admin';
    const result = await reviewService.deleteReview(req.params.id, req.user._id, isAdmin);
    res.json({ success: true, ...result });
});
