import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide category name'],
            unique: true,
            trim: true,
            maxlength: [50, 'Category name cannot exceed 50 characters'],
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
        },
        image: {
            public_id: String,
            url: String,
        },
        description: {
            type: String,
            maxlength: [500, 'Description cannot exceed 500 characters'],
        },
    },
    {
        timestamps: true,
    }
);

// Generate slug before saving
categorySchema.pre('save', function () {
    this.slug = this.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
});

const Category = mongoose.model('Category', categorySchema);
export default Category;
