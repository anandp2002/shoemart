import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide product name'],
            trim: true,
            maxlength: [200, 'Product name cannot exceed 200 characters'],
        },
        description: {
            type: String,
            required: [true, 'Please provide product description'],
            maxlength: [2000, 'Description cannot exceed 2000 characters'],
        },
        price: {
            type: Number,
            required: [true, 'Please provide product price'],
            min: [0, 'Price cannot be negative'],
        },
        mrp: {
            type: Number,
            required: [true, 'Please provide MRP'],
            min: [0, 'MRP cannot be negative'],
        },
        discount: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
        images: [
            {
                public_id: { type: String, required: true },
                url: { type: String, required: true },
            },
        ],
        brand: {
            type: String,
            required: [true, 'Please provide product brand'],
            trim: true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'Please provide product category'],
        },
        sizes: [
            {
                size: {
                    type: Number,
                    required: true,
                },
                stock: {
                    type: Number,
                    required: true,
                    default: 0,
                    min: 0,
                },
            },
        ],
        color: {
            type: String,
            required: [true, 'Please provide product color'],
            trim: true,
        },
        gender: {
            type: String,
            enum: ['men', 'women', 'unisex', 'kids'],
            required: [true, 'Please specify gender category'],
        },
        ratings: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        numReviews: {
            type: Number,
            default: 0,
        },
        featured: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        totalStock: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Virtual for reviews
productSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'product',
    justOne: false,
});

// Calculate total stock before saving
productSchema.pre('save', function () {
    if (this.sizes && this.sizes.length > 0) {
        this.totalStock = this.sizes.reduce((total, s) => total + s.stock, 0);
    }
    // Calculate discount
    if (this.mrp > 0 && this.price < this.mrp) {
        this.discount = Math.round(((this.mrp - this.price) / this.mrp) * 100);
    }
});

// Indexes for search and filter performance
productSchema.index({ name: 'text', description: 'text', brand: 'text' });
productSchema.index({ category: 1, gender: 1, price: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ featured: 1, isActive: 1 });

const Product = mongoose.model('Product', productSchema);
export default Product;
