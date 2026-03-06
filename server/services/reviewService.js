import Review from '../models/Review.js';

class ReviewService {
    // Create a review
    async createReview(userId, productId, { rating, title, comment }) {
        // Check for existing review
        const existingReview = await Review.findOne({
            user: userId,
            product: productId,
        });

        if (existingReview) {
            const error = new Error('You have already reviewed this product');
            error.statusCode = 400;
            throw error;
        }

        const review = await Review.create({
            user: userId,
            product: productId,
            rating,
            title,
            comment,
        });

        return await review.populate('user', 'name avatar');
    }

    // Get reviews for a product
    async getProductReviews(productId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const reviews = await Review.find({ product: productId })
            .populate('user', 'name avatar')
            .sort('-createdAt')
            .skip(skip)
            .limit(limit);

        const total = await Review.countDocuments({ product: productId });

        // Get rating distribution
        const ratingDistribution = await Review.aggregate([
            { $match: { product: productId } },
            { $group: { _id: '$rating', count: { $sum: 1 } } },
            { $sort: { _id: -1 } },
        ]);

        return {
            reviews,
            total,
            totalPages: Math.ceil(total / limit),
            ratingDistribution,
        };
    }

    // Delete a review
    async deleteReview(reviewId, userId, isAdmin = false) {
        const query = isAdmin ? { _id: reviewId } : { _id: reviewId, user: userId };
        const review = await Review.findOne(query);

        if (!review) {
            const error = new Error('Review not found');
            error.statusCode = 404;
            throw error;
        }

        await Review.findOneAndDelete({ _id: reviewId });
        return { message: 'Review deleted' };
    }
}

export default new ReviewService();
