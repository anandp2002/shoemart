import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

class CartService {
    // Get user's cart
    async getCart(userId) {
        let cart = await Cart.findOne({ user: userId }).populate(
            'items.product',
            'name price images isActive sizes'
        );

        if (!cart) {
            cart = await Cart.create({ user: userId, items: [] });
        }

        return cart;
    }

    // Add item to cart
    async addToCart(userId, { productId, size, quantity = 1 }) {
        const product = await Product.findById(productId);
        if (!product || !product.isActive) {
            const error = new Error('Product not found or unavailable');
            error.statusCode = 404;
            throw error;
        }

        // Check size availability
        const sizeOption = product.sizes.find((s) => s.size === Number(size));
        if (!sizeOption || sizeOption.stock < quantity) {
            const error = new Error('Selected size is out of stock');
            error.statusCode = 400;
            throw error;
        }

        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = await Cart.create({ user: userId, items: [] });
        }

        // Check if item already exists in cart
        const existingItemIndex = cart.items.findIndex(
            (item) =>
                item.product.toString() === productId && item.size === Number(size)
        );

        if (existingItemIndex > -1) {
            // Update quantity
            const newQty = cart.items[existingItemIndex].quantity + quantity;
            if (newQty > sizeOption.stock) {
                const error = new Error(`Only ${sizeOption.stock} items available`);
                error.statusCode = 400;
                throw error;
            }
            cart.items[existingItemIndex].quantity = newQty;
        } else {
            // Add new item
            cart.items.push({
                product: productId,
                name: product.name,
                image: product.images[0]?.url || '',
                price: product.price,
                size: Number(size),
                quantity,
            });
        }

        await cart.save();
        return cart;
    }

    // Update item quantity
    async updateCartItem(userId, itemId, quantity) {
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            const error = new Error('Cart not found');
            error.statusCode = 404;
            throw error;
        }

        const item = cart.items.id(itemId);
        if (!item) {
            const error = new Error('Item not found in cart');
            error.statusCode = 404;
            throw error;
        }

        // Check stock
        const product = await Product.findById(item.product);
        const sizeOption = product.sizes.find((s) => s.size === item.size);
        if (sizeOption && quantity > sizeOption.stock) {
            const error = new Error(`Only ${sizeOption.stock} items available`);
            error.statusCode = 400;
            throw error;
        }

        if (quantity <= 0) {
            cart.items.pull(itemId);
        } else {
            item.quantity = quantity;
        }

        await cart.save();
        return cart;
    }

    // Remove item from cart
    async removeCartItem(userId, itemId) {
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            const error = new Error('Cart not found');
            error.statusCode = 404;
            throw error;
        }

        cart.items.pull(itemId);
        await cart.save();
        return cart;
    }

    // Clear cart
    async clearCart(userId) {
        const cart = await Cart.findOne({ user: userId });
        if (cart) {
            cart.items = [];
            await cart.save();
        }
        return cart;
    }
}

export default new CartService();
