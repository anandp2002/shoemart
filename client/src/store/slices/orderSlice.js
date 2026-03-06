import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

export const createOrder = createAsyncThunk('orders/create', async (orderData, { rejectWithValue }) => {
    try {
        const { data } = await API.post('/orders', orderData);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to create order');
    }
});

export const fetchMyOrders = createAsyncThunk('orders/fetchMine', async (params = {}, { rejectWithValue }) => {
    try {
        const queryString = new URLSearchParams(params).toString();
        const { data } = await API.get(`/orders/me?${queryString}`);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
});

export const fetchOrderDetail = createAsyncThunk('orders/fetchDetail', async (id, { rejectWithValue }) => {
    try {
        const { data } = await API.get(`/orders/${id}`);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Order not found');
    }
});

export const fetchOrderByPaymentIntent = createAsyncThunk('orders/fetchByPaymentIntent', async (paymentIntentId, { rejectWithValue }) => {
    try {
        const { data } = await API.get(`/orders/payment/${paymentIntentId}`);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Order not found');
    }
});

const orderSlice = createSlice({
    name: 'orders',
    initialState: {
        orders: [],
        order: null,
        total: 0,
        totalPages: 0,
        loading: false,
        error: null,
        success: false,
    },
    reducers: {
        clearOrderSuccess: (state) => {
            state.success = false;
        },
        clearOrderError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.order = action.payload.order;
                state.success = true;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchMyOrders.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchMyOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload.orders;
                state.total = action.payload.total;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(fetchMyOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchOrderDetail.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchOrderDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.order = action.payload.order;
            })
            .addCase(fetchOrderDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchOrderByPaymentIntent.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchOrderByPaymentIntent.fulfilled, (state, action) => {
                state.loading = false;
                state.order = action.payload.order;
            })
            .addCase(fetchOrderByPaymentIntent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearOrderSuccess, clearOrderError } = orderSlice.actions;
export default orderSlice.reducer;
