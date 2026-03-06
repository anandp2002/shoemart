import asyncHandler from 'express-async-handler';
import paymentService from '../services/paymentService.js';

// @desc    Create payment intent
// @route   POST /api/v1/payment/create-intent
export const createPaymentIntent = asyncHandler(async (req, res) => {
    const { amount, shippingAddress } = req.body;

    if (!amount || amount <= 0) {
        res.status(400);
        throw new Error('Invalid amount');
    }

    const result = await paymentService.createPaymentIntent(amount, 'inr', {
        userId: req.user._id.toString(),
        shippingAddress: JSON.stringify(shippingAddress),
    });

    res.json({ success: true, ...result });
});

// @desc    Stripe webhook handler
// @route   POST /api/v1/payment/webhook
export const handleWebhook = asyncHandler(async (req, res) => {
    const signature = req.headers['stripe-signature'];

    try {
        const event = paymentService.verifyWebhookSignature(req.body, signature);

        switch (event.type) {
            case 'payment_intent.succeeded':
                console.log('Payment succeeded:', event.data.object.id);
                break;
            case 'payment_intent.created':
                console.info('Payment intent created:', event.data.object.id);
                break;
            case 'charge.succeeded':
                console.info('Charge succeeded:', event.data.object.id);
                break;
            case 'charge.updated':
                console.info('Charge updated:', event.data.object.id);
                break;
            case 'payment_intent.payment_failed':
                console.warn('Payment failed:', event.data.object.id);
                break;
            default:
                console.log('Skipping unhandled event type:', event.type);
        }

        res.json({ received: true });
    } catch (err) {
        console.error('Webhook error:', err.message);
        res.status(400).json({ error: 'Webhook signature verification failed' });
    }
});

// @desc    Get Stripe publishable key
// @route   GET /api/v1/payment/config
export const getStripeConfig = asyncHandler(async (req, res) => {
    res.json({
        success: true,
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
});
