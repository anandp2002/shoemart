import asyncHandler from 'express-async-handler';
import authService from '../services/authService.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register user
// @route   POST /api/v1/auth/register
export const register = asyncHandler(async (req, res) => {
    const user = await authService.register(req.body);
    const token = generateToken(res, user._id, user.getSignedJwtToken.bind(user));

    res.status(201).json({
        success: true,
        token,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
        },
    });
});

// @desc    Login user
// @route   POST /api/v1/auth/login
export const login = asyncHandler(async (req, res) => {
    const user = await authService.login(req.body);
    const token = generateToken(res, user._id, user.getSignedJwtToken.bind(user));

    res.json({
        success: true,
        token,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
        },
    });
});

// @desc    Logout user
// @route   GET /api/v1/auth/logout
export const logout = asyncHandler(async (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0),
    });

    res.json({ success: true, message: 'Logged out successfully' });
});

// @desc    Get current user profile
// @route   GET /api/v1/auth/me
export const getMe = asyncHandler(async (req, res) => {
    const user = await authService.getProfile(req.user._id);
    res.json({ success: true, user });
});

// @desc    Forgot password
// @route   POST /api/v1/auth/forgot-password
export const forgotPassword = asyncHandler(async (req, res) => {
    const result = await authService.forgotPassword(
        req.body.email,
        req.protocol,
        req.get('host')
    );
    res.json({ success: true, ...result });
});

// @desc    Reset password
// @route   PUT /api/v1/auth/reset-password/:token
export const resetPassword = asyncHandler(async (req, res) => {
    const user = await authService.resetPassword(req.params.token, req.body.password);
    const token = generateToken(res, user._id, user.getSignedJwtToken.bind(user));

    res.json({
        success: true,
        token,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    });
});
