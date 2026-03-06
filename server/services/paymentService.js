import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

class PaymentService {
    // Create a payment intent
    async createPaymentIntent(amount, currency = 'inr', metadata = {}) {
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
        return stripe.webhooks.constructEvent(
            payload,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    }

    // Get payment intent details
    async getPaymentIntent(paymentIntentId) {
        return await stripe.paymentIntents.retrieve(paymentIntentId);
    }

    // Create refund
    async createRefund(paymentIntentId, amount) {
        return await stripe.refunds.create({
            payment_intent: paymentIntentId,
            amount: amount ? Math.round(amount * 100) : undefined,
        });
    }
}

export default new PaymentService();
