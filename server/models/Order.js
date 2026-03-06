import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
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
        min: 1,
    },
});

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        items: [orderItemSchema],
        shippingAddress: {
            street: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            zipCode: { type: String, required: true },
            country: { type: String, required: true, default: 'India' },
            phone: { type: String, required: true },
        },
        paymentInfo: {
            stripePaymentIntentId: String,
            status: {
                type: String,
                enum: ['pending', 'paid', 'failed', 'refunded'],
                default: 'pending',
            },
            paidAt: Date,
        },
        itemsPrice: {
            type: Number,
            required: true,
            default: 0,
        },
        taxPrice: {
            type: Number,
            required: true,
            default: 0,
        },
        shippingPrice: {
            type: Number,
            required: true,
            default: 0,
        },
        totalPrice: {
            type: Number,
            required: true,
            default: 0,
        },
        orderStatus: {
            type: String,
            enum: ['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
            default: 'Processing',
        },
        deliveredAt: Date,
        cancelledAt: Date,
        trackingNumber: String,
    },
    {
        timestamps: true,
    }
);

// Index for user order lookups
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1 });

const Order = mongoose.model('Order', orderSchema);
export default Order;
