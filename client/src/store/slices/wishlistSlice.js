import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

export const toggleWishlist = createAsyncThunk(
    'wishlist/toggle',
    async (productId, { rejectWithValue }) => {
        try {
            const { data } = await API.put(`/users/wishlist/${productId}`);
            return { productId, wishlist: data.wishlist };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update wishlist');
        }
    }
);

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: {
        togglingId: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(toggleWishlist.pending, (state, action) => {
                state.togglingId = action.meta.arg;
            })
            .addCase(toggleWishlist.fulfilled, (state) => {
                state.togglingId = null;
            })
            .addCase(toggleWishlist.rejected, (state) => {
                state.togglingId = null;
            });
    },
});

export default wishlistSlice.reducer;
