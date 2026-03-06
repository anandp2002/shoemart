import mongoose from 'mongoose';
import Product from './Product.js';

const reviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        rating: {
            type: Number,
            required: [true, 'Please provide a rating'],
            min: 1,
            max: 5,
        },
        title: {
            type: String,
            required: [true, 'Please provide a review title'],
            trim: true,
            maxlength: [100, 'Title cannot exceed 100 characters'],
        },
        comment: {
            type: String,
            required: [true, 'Please provide a review comment'],
            maxlength: [1000, 'Comment cannot exceed 1000 characters'],
        },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate reviews per user per product
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

// Static method to calculate average ratings
reviewSchema.statics.calcAverageRatings = async function (productId) {
    const stats = await this.aggregate([
        { $match: { product: productId } },
        {
            $group: {
                _id: '$product',
                numReviews: { $sum: 1 },
                avgRating: { $avg: '$rating' },
            },
        },
    ]);

    if (stats.length > 0) {
        await Product.findByIdAndUpdate(productId, {
            ratings: Math.round(stats[0].avgRating * 10) / 10,
            numReviews: stats[0].numReviews,
        });
    } else {
        await Product.findByIdAndUpdate(productId, {
            ratings: 0,
            numReviews: 0,
        });
    }
};

// Update ratings after save
reviewSchema.post('save', function () {
    this.constructor.calcAverageRatings(this.product);
});

// Update ratings after delete
reviewSchema.post('findOneAndDelete', function (doc) {
    if (doc) {
        doc.constructor.calcAverageRatings(doc.product);
    }
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
