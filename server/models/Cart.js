import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    size: { type: Number, required: true },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1'],
        default: 1,
    },
});

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        items: [cartItemSchema],
        totalPrice: {
            type: Number,
            default: 0,
        },
        totalItems: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Calculate totals before saving
cartSchema.pre('save', function () {
    this.totalPrice = this.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );
    this.totalItems = this.items.reduce(
        (total, item) => total + item.quantity,
        0
    );
});

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
