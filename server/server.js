import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import userRoutes from './routes/userRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://shoemart-navy.vercel.app',
    process.env.CLIENT_URL,
]
    .filter(Boolean)
    .map((url) => (url.endsWith('/') ? url.slice(0, -1) : url));

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin) return callback(null, true);
            const isAllowed =
                allowedOrigins.some((allowed) => origin === allowed || origin === allowed + '/' || allowed === origin + '/') ||
                (origin && origin.endsWith('.vercel.app'));

            if (isAllowed) {
                callback(null, origin);
            } else {
                callback(new Error('CORS policy violation'));
            }
        },
        credentials: true,
    })
);

// Security middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 2000, // Increased for development
    message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use('/api', limiter);

// Next we need the raw body for Stripe Webhooks BEFORE express.json() parses it into an object
app.use('/api/v1/payment/webhook', express.raw({ type: 'application/json' }));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());


// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/payment', paymentRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
    });
}

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

export default app;
