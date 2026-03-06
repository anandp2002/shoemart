import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';

class OrderService {
    // Create order from cart
    async createOrder(userId, shippingAddress, paymentIntentId) {
        const cart = await Cart.findOne({ user: userId });
        if (!cart || cart.items.length === 0) {
            const error = new Error('Cart is empty');
            error.statusCode = 400;
            throw error;
        }

        // Verify stock and calculate prices
        let itemsPrice = 0;
        for (const item of cart.items) {
            const product = await Product.findById(item.product);
            if (!product || !product.isActive) {
                const error = new Error(`Product "${item.name}" is no longer available`);
                error.statusCode = 400;
                throw error;
            }

            const sizeOption = product.sizes.find((s) => s.size === item.size);
            if (!sizeOption || sizeOption.stock < item.quantity) {
                const error = new Error(
                    `"${item.name}" (Size ${item.size}) is out of stock`
                );
                error.statusCode = 400;
                throw error;
            }

            itemsPrice += item.price * item.quantity;
        }

        const taxPrice = Math.round(itemsPrice * 0.18 * 100) / 100; // 18% GST
        const shippingPrice = itemsPrice > 999 ? 0 : 99; // Free shipping over ₹999
        const totalPrice = itemsPrice + taxPrice + shippingPrice;

        const order = await Order.create({
            user: userId,
            items: cart.items,
            shippingAddress,
            paymentInfo: {
                stripePaymentIntentId: paymentIntentId,
                status: 'paid',
                paidAt: Date.now(),
            },
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            orderStatus: 'Confirmed',
        });

        // Reduce stock
        for (const item of cart.items) {
            const product = await Product.findById(item.product);
            const sizeOption = product.sizes.find((s) => s.size === item.size);
            sizeOption.stock -= item.quantity;
            await product.save();
        }

        // Clear cart
        cart.items = [];
        await cart.save();

        return order;
    }

    // Get user's orders
    async getUserOrders(userId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const orders = await Order.find({ user: userId })
            .sort('-createdAt')
            .skip(skip)
            .limit(limit);

        const total = await Order.countDocuments({ user: userId });
        return { orders, total, totalPages: Math.ceil(total / limit), page };
    }

    // Get single order
    async getOrderById(orderId, userId, isAdmin = false) {
        const query = isAdmin ? { _id: orderId } : { _id: orderId, user: userId };
        const order = await Order.findOne(query).populate('user', 'name email');

        if (!order) {
            const error = new Error('Order not found');
            error.statusCode = 404;
            throw error;
        }

        return order;
    }

    // Get order by payment intent ID
    async getOrderByPaymentIntentId(paymentIntentId, userId) {
        const order = await Order.findOne({
            'paymentInfo.stripePaymentIntentId': paymentIntentId,
            user: userId
        }).populate('user', 'name email');

        return order;
    }

    // Update order status (admin)
    async updateOrderStatus(orderId, status) {
        const order = await Order.findById(orderId);
        if (!order) {
            const error = new Error('Order not found');
            error.statusCode = 404;
            throw error;
        }

        if (order.orderStatus === 'Delivered') {
            const error = new Error('Order already delivered');
            error.statusCode = 400;
            throw error;
        }

        if (order.orderStatus === 'Cancelled') {
            const error = new Error('Order has been cancelled');
            error.statusCode = 400;
            throw error;
        }

        order.orderStatus = status;
        if (status === 'Delivered') {
            order.deliveredAt = Date.now();
        }
        if (status === 'Cancelled') {
            order.cancelledAt = Date.now();
            // Restore stock
            for (const item of order.items) {
                const product = await Product.findById(item.product);
                if (product) {
                    const sizeOption = product.sizes.find((s) => s.size === item.size);
                    if (sizeOption) {
                        sizeOption.stock += item.quantity;
                        await product.save();
                    }
                }
            }
        }

        await order.save();
        return order;
    }

    // Get all orders (admin)
    async getAllOrders(queryStr) {
        const page = Number(queryStr.page) || 1;
        const limit = Number(queryStr.limit) || 20;
        const skip = (page - 1) * limit;

        const filter = {};
        if (queryStr.status) filter.orderStatus = queryStr.status;

        const orders = await Order.find(filter)
            .populate('user', 'name email')
            .sort('-createdAt')
            .skip(skip)
            .limit(limit);

        const total = await Order.countDocuments(filter);
        return { orders, total, totalPages: Math.ceil(total / limit), page };
    }

    // Get order stats (admin)
    async getOrderStats() {
        const totalOrders = await Order.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalUsers = await User.countDocuments();

        const totalRevenue = await Order.aggregate([
            { $match: { 'paymentInfo.status': 'paid' } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } },
        ]);

        const ordersByStatus = await Order.aggregate([
            { $group: { _id: '$orderStatus', count: { $sum: 1 } } },
        ]);

        const recentOrders = await Order.find()
            .populate('user', 'name email')
            .sort('-createdAt')
            .limit(5);

        return {
            totalOrders,
            totalProducts,
            totalUsers,
            totalRevenue: totalRevenue[0]?.total || 0,
            ordersByStatus,
            recentOrders,
        };
    }
}

export default new OrderService();
