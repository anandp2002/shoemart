import crypto from 'crypto';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';

class AuthService {
    // Register a new user
    async register({ name, email, password, phone }) {
        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const error = new Error('User already exists with this email');
            error.statusCode = 400;
            throw error;
        }

        const user = await User.create({ name, email, password, phone });
        return user;
    }

    // Login user
    async login({ email, password }) {
        if (!email || !password) {
            const error = new Error('Please provide email and password');
            error.statusCode = 400;
            throw error;
        }

        const user = await User.findOne({ email }).select('+password').populate('wishlist', 'name price images brand mrp ratings stock');
        if (!user) {
            const error = new Error('Invalid email or password');
            error.statusCode = 401;
            throw error;
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            const error = new Error('Invalid email or password');
            error.statusCode = 401;
            throw error;
        }

        return user;
    }

    // Get user profile
    async getProfile(userId) {
        const user = await User.findById(userId).populate('wishlist', 'name price images brand mrp ratings sizes');
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        return user;
    }

    // Forgot password
    async forgotPassword(email, reqProtocol, reqHost) {
        const user = await User.findOne({ email });
        if (!user) {
            const error = new Error('No user found with this email');
            error.statusCode = 404;
            throw error;
        }

        const resetToken = user.getResetPasswordToken();
        await user.save({ validateBeforeSave: false });

        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

        const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f59e0b;">ShoeMart - Password Reset</h2>
        <p>You requested a password reset. Click the button below to reset your password:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #f59e0b; color: #000; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
        <p style="margin-top: 20px; color: #666;">This link expires in 15 minutes. If you didn't request this, please ignore this email.</p>
      </div>
    `;

        try {
            await sendEmail({
                email: user.email,
                subject: 'ShoeMart - Password Reset',
                html,
            });
            return { message: 'Password reset email sent' };
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });
            throw new Error('Email could not be sent');
        }
    }

    // Reset password
    async resetPassword(token, password) {
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            const error = new Error('Invalid or expired reset token');
            error.statusCode = 400;
            throw error;
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        return user;
    }
}

export default new AuthService();
