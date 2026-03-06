import Stripe from 'stripe';

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

class PaymentService {
    // Create a payment intent
    async createPaymentIntent(amount, currency = 'inr', metadata = {}) {
        if (!stripe) throw new Error('Stripe is not configured with a valid Secret Key');

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to paise/cents
            currency,
            metadata,
            automatic_payment_methods: {
                enabled: true,
            },
        });

        return {
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
        };
    }

    // Verify webhook signature
    verifyWebhookSignature(payload, signature) {
        if (!stripe) throw new Error('Stripe is not configured');
        return stripe.webhooks.constructEvent(
            payload,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    }

    // Get payment intent details
    async getPaymentIntent(paymentIntentId) {
        if (!stripe) throw new Error('Stripe is not configured');
        return await stripe.paymentIntents.retrieve(paymentIntentId);
    }

    // Create refund
    async createRefund(paymentIntentId, amount) {
        if (!stripe) throw new Error('Stripe is not configured');
        return await stripe.refunds.create({
            payment_intent: paymentIntentId,
            amount: amount ? Math.round(amount * 100) : undefined,
        });
    }
}

export default new PaymentService();
