import asyncHandler from 'express-async-handler';
import productService from '../services/productService.js';

// @desc    Get all products
// @route   GET /api/v1/products
export const getProducts = asyncHandler(async (req, res) => {
    const result = await productService.getProducts(req.query);
    res.json({ success: true, ...result });
});

// @desc    Get single product
// @route   GET /api/v1/products/:id
export const getProduct = asyncHandler(async (req, res) => {
    const product = await productService.getProductById(req.params.id);
    res.json({ success: true, product });
});

// @desc    Create product (Admin)
// @route   POST /api/v1/products
export const createProduct = asyncHandler(async (req, res) => {
    const product = await productService.createProduct(req.body, req.files);
    res.status(201).json({ success: true, product });
});

// @desc    Update product (Admin)
// @route   PUT /api/v1/products/:id
export const updateProduct = asyncHandler(async (req, res) => {
    const product = await productService.updateProduct(req.params.id, req.body, req.files);
    res.json({ success: true, product });
});

// @desc    Delete product (Admin)
// @route   DELETE /api/v1/products/:id
export const deleteProduct = asyncHandler(async (req, res) => {
    const result = await productService.deleteProduct(req.params.id);
    res.json({ success: true, ...result });
});

// @desc    Get featured products
// @route   GET /api/v1/products/featured
export const getFeaturedProducts = asyncHandler(async (req, res) => {
    const products = await productService.getFeaturedProducts(req.query.limit);
    res.json({ success: true, products });
});

// @desc    Get all categories
// @route   GET /api/v1/products/categories
export const getCategories = asyncHandler(async (req, res) => {
    const categories = await productService.getCategories();
    res.json({ success: true, categories });
});

// @desc    Create category (Admin)
// @route   POST /api/v1/products/categories
export const createCategory = asyncHandler(async (req, res) => {
    const category = await productService.createCategory(req.body, req.file);
    res.status(201).json({ success: true, category });
});

// @desc    Get all brands
// @route   GET /api/v1/products/brands
export const getBrands = asyncHandler(async (req, res) => {
    const brands = await productService.getBrands();
    res.json({ success: true, brands });
});
