import asyncHandler from 'express-async-handler';
import orderService from '../services/orderService.js';
import emailService from '../services/emailService.js';

// @desc    Create order
// @route   POST /api/v1/orders
export const createOrder = asyncHandler(async (req, res) => {
    const { shippingAddress, paymentIntentId } = req.body;
    const order = await orderService.createOrder(
        req.user._id,
        shippingAddress,
        paymentIntentId
    );

    // Send confirmation email (fire and forget)
    try {
        await emailService.sendOrderConfirmation(order, req.user.email);
    } catch (e) {
        console.error('Failed to send order confirmation email:', e.message);
    }

    res.status(201).json({ success: true, order });
});

// @desc    Get user orders
// @route   GET /api/v1/orders/me
export const getMyOrders = asyncHandler(async (req, res) => {
    const result = await orderService.getUserOrders(
        req.user._id,
        req.query.page,
        req.query.limit
    );
    res.json({ success: true, ...result });
});

// @desc    Get single order
// @route   GET /api/v1/orders/:id
export const getOrder = asyncHandler(async (req, res) => {
    const isAdmin = req.user.role === 'admin';
    const order = await orderService.getOrderById(req.params.id, req.user._id, isAdmin);
    res.json({ success: true, order });
});

// @desc    Update order status (Admin)
// @route   PUT /api/v1/orders/:id
export const updateOrderStatus = asyncHandler(async (req, res) => {
    const order = await orderService.updateOrderStatus(req.params.id, req.body.status);

    // Send status update email (fire and forget)
    try {
        const populatedOrder = await order.populate('user', 'email');
        await emailService.sendOrderStatusUpdate(order, populatedOrder.user.email);
    } catch (e) {
        console.error('Failed to send status update email:', e.message);
    }

    res.json({ success: true, order });
});

// @desc    Get all orders (Admin)
// @route   GET /api/v1/orders
export const getAllOrders = asyncHandler(async (req, res) => {
    const result = await orderService.getAllOrders(req.query);
    res.json({ success: true, ...result });
});

// @desc    Get order stats (Admin)
// @route   GET /api/v1/orders/stats
export const getOrderStats = asyncHandler(async (req, res) => {
    const stats = await orderService.getOrderStats();
    res.json({ success: true, ...stats });
});
