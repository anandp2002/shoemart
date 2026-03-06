import Product from '../models/Product.js';
import Category from '../models/Category.js';
import ApiFeatures from '../utils/apiFeatures.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../middleware/upload.js';

class ProductService {
    // Get all products with search/filter/sort/paginate
    async getProducts(queryStr) {
        const resultsPerPage = Number(queryStr.limit) || 12;

        // Count total matching documents
        const countFeatures = new ApiFeatures(Product.find(), queryStr)
            .search()
            .filter();
        const totalProducts = await countFeatures.query.clone().countDocuments();

        // Get paginated results
        const features = new ApiFeatures(Product.find(), queryStr)
            .search()
            .filter()
            .sort()
            .paginate(resultsPerPage);

        const products = await features.query.populate('category', 'name slug');
        const totalPages = Math.ceil(totalProducts / resultsPerPage);

        return {
            products,
            totalProducts,
            totalPages,
            currentPage: features.page,
            resultsPerPage,
        };
    }

    // Get single product by ID
    async getProductById(id) {
        const product = await Product.findById(id)
            .populate('category', 'name slug')
            .populate({
                path: 'reviews',
                populate: { path: 'user', select: 'name avatar' },
            });

        if (!product) {
            const error = new Error('Product not found');
            error.statusCode = 404;
            throw error;
        }

        return product;
    }

    // Create product (admin)
    async createProduct(data, files) {
        // Upload images to Cloudinary
        const images = [];
        if (files && files.length > 0) {
            for (const file of files) {
                const result = await uploadToCloudinary(file.buffer, 'shoemart/products');
                images.push({
                    public_id: result.public_id,
                    url: result.secure_url,
                });
            }
        }

        // Verify category exists
        const category = await Category.findById(data.category);
        if (!category) {
            const error = new Error('Category not found');
            error.statusCode = 404;
            throw error;
        }

        // Parse sizes if sent as JSON string
        let sizes = data.sizes;
        if (typeof sizes === 'string') {
            sizes = JSON.parse(sizes);
        }

        const product = await Product.create({
            ...data,
            sizes,
            images,
        });

        return product;
    }

    // Update product (admin)
    async updateProduct(id, data, files) {
        let product = await Product.findById(id);
        if (!product) {
            const error = new Error('Product not found');
            error.statusCode = 404;
            throw error;
        }

        // Handle new images
        if (files && files.length > 0) {
            // Delete old images from Cloudinary
            for (const img of product.images) {
                await deleteFromCloudinary(img.public_id);
            }

            // Upload new images
            const images = [];
            for (const file of files) {
                const result = await uploadToCloudinary(file.buffer, 'shoemart/products');
                images.push({
                    public_id: result.public_id,
                    url: result.secure_url,
                });
            }
            data.images = images;
        }

        // Parse sizes if sent as JSON string
        if (data.sizes && typeof data.sizes === 'string') {
            data.sizes = JSON.parse(data.sizes);
        }

        product = await Product.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });

        return product;
    }

    // Delete product (soft delete — admin)
    async deleteProduct(id) {
        const product = await Product.findById(id);
        if (!product) {
            const error = new Error('Product not found');
            error.statusCode = 404;
            throw error;
        }

        product.isActive = false;
        await product.save();
        return { message: 'Product removed' };
    }

    // Get featured products
    async getFeaturedProducts(limit = 8) {
        return await Product.find({ featured: true, isActive: true })
            .limit(limit)
            .populate('category', 'name slug');
    }

    // Get all categories
    async getCategories() {
        return await Category.find().sort('name');
    }

    // Create category (admin)
    async createCategory(data, file) {
        let image = {};
        if (file) {
            const result = await uploadToCloudinary(file.buffer, 'shoemart/categories');
            image = { public_id: result.public_id, url: result.secure_url };
        }

        const category = await Category.create({ ...data, image });
        return category;
    }

    // Get distinct brands
    async getBrands() {
        return await Product.distinct('brand', { isActive: true });
    }
}

export default new ProductService();
