import express from 'express';
import { createPaymentIntent, handleWebhook, getStripeConfig } from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/config', getStripeConfig);
router.post('/create-intent', protect, createPaymentIntent);

// Webhook needs raw body, so we handle it specially
router.post(
    '/webhook',
    express.raw({ type: 'application/json' }),
    handleWebhook
);

export default router;
