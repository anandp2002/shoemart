import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

export const fetchCart = createAsyncThunk('cart/fetch', async (_, { rejectWithValue }) => {
    try {
        const { data } = await API.get('/cart');
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
    }
});

export const addToCart = createAsyncThunk('cart/add', async ({ productId, size, quantity }, { rejectWithValue }) => {
    try {
        const { data } = await API.post('/cart', { productId, size, quantity });
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to add to cart');
    }
});

export const updateCartItem = createAsyncThunk('cart/update', async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
        const { data } = await API.put(`/cart/${itemId}`, { quantity });
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update cart');
    }
});

export const removeCartItem = createAsyncThunk('cart/remove', async (itemId, { rejectWithValue }) => {
    try {
        const { data } = await API.delete(`/cart/${itemId}`);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to remove item');
    }
});

export const clearCart = createAsyncThunk('cart/clear', async (_, { rejectWithValue }) => {
    try {
        const { data } = await API.delete('/cart');
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to clear cart');
    }
});

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        totalPrice: 0,
        totalItems: 0,
        loading: false,
        error: null,
    },
    reducers: {
        clearCartState: (state) => {
            state.items = [];
            state.totalPrice = 0;
            state.totalItems = 0;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.cart.items;
                state.totalPrice = action.payload.cart.totalPrice;
                state.totalItems = action.payload.cart.totalItems;
            })
            .addCase(fetchCart.rejected, (state) => {
                state.loading = false;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.items = action.payload.cart.items;
                state.totalPrice = action.payload.cart.totalPrice;
                state.totalItems = action.payload.cart.totalItems;
            })
            .addCase(updateCartItem.fulfilled, (state, action) => {
                state.items = action.payload.cart.items;
                state.totalPrice = action.payload.cart.totalPrice;
                state.totalItems = action.payload.cart.totalItems;
            })
            .addCase(removeCartItem.fulfilled, (state, action) => {
                state.items = action.payload.cart.items;
                state.totalPrice = action.payload.cart.totalPrice;
                state.totalItems = action.payload.cart.totalItems;
            })
            .addCase(clearCart.fulfilled, (state) => {
                state.items = [];
                state.totalPrice = 0;
                state.totalItems = 0;
            });
    },
});

export const { clearCartState } = cartSlice.actions;
export default cartSlice.reducer;
