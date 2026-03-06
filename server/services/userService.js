import User from '../models/User.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../middleware/upload.js';

class UserService {
    // Update user profile
    async updateProfile(userId, data) {
        const user = await User.findById(userId);
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        user.name = data.name || user.name;
        user.phone = data.phone || user.phone;

        if (data.email && data.email !== user.email) {
            const emailExists = await User.findOne({ email: data.email });
            if (emailExists) {
                const error = new Error('Email already in use');
                error.statusCode = 400;
                throw error;
            }
            user.email = data.email;
        }

        await user.save();
        return user;
    }

    // Update avatar
    async updateAvatar(userId, file) {
        const user = await User.findById(userId);
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        // Delete old avatar if it exists
        if (user.avatar?.public_id) {
            await deleteFromCloudinary(user.avatar.public_id);
        }

        const result = await uploadToCloudinary(file.buffer, 'shoemart/avatars');
        user.avatar = {
            public_id: result.public_id,
            url: result.secure_url,
        };

        await user.save();
        return user;
    }

    // Update password
    async updatePassword(userId, currentPassword, newPassword) {
        const user = await User.findById(userId).select('+password');
        const isMatch = await user.matchPassword(currentPassword);

        if (!isMatch) {
            const error = new Error('Current password is incorrect');
            error.statusCode = 400;
            throw error;
        }

        user.password = newPassword;
        await user.save();
        return user;
    }

    // Add address
    async addAddress(userId, address) {
        const user = await User.findById(userId);
        if (address.isDefault) {
            user.addresses.forEach((addr) => (addr.isDefault = false));
        }
        user.addresses.push(address);
        await user.save();
        return user.addresses;
    }

    // Update address
    async updateAddress(userId, addressId, addressData) {
        const user = await User.findById(userId);
        const address = user.addresses.id(addressId);

        if (!address) {
            const error = new Error('Address not found');
            error.statusCode = 404;
            throw error;
        }

        if (addressData.isDefault) {
            user.addresses.forEach((addr) => (addr.isDefault = false));
        }

        Object.assign(address, addressData);
        await user.save();
        return user.addresses;
    }

    // Delete address
    async deleteAddress(userId, addressId) {
        const user = await User.findById(userId);
        user.addresses.pull(addressId);
        await user.save();
        return user.addresses;
    }

    // Toggle wishlist
    async toggleWishlist(userId, productId) {
        const user = await User.findById(userId);
        const index = user.wishlist.indexOf(productId);

        if (index > -1) {
            user.wishlist.splice(index, 1);
        } else {
            user.wishlist.push(productId);
        }

        await user.save();
        return user.wishlist;
    }

    // Get all users (admin)
    async getAllUsers(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const users = await User.find()
            .select('-password')
            .sort('-createdAt')
            .skip(skip)
            .limit(limit);

        const total = await User.countDocuments();
        return { users, total, totalPages: Math.ceil(total / limit), page };
    }

    // Update user role (admin)
    async updateUserRole(userId, role) {
        const user = await User.findByIdAndUpdate(
            userId,
            { role },
            { new: true, runValidators: true }
        );
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        return user;
    }
}

export default new UserService();
