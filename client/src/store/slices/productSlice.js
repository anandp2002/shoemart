import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

export const fetchProducts = createAsyncThunk('products/fetchAll', async (params, { rejectWithValue }) => {
    try {
        const queryString = new URLSearchParams(params).toString();
        const { data } = await API.get(`/products?${queryString}`);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
});

export const fetchProductDetail = createAsyncThunk('products/fetchDetail', async (id, { rejectWithValue }) => {
    try {
        const { data } = await API.get(`/products/${id}`);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Product not found');
    }
});

export const fetchFeaturedProducts = createAsyncThunk('products/fetchFeatured', async (_, { rejectWithValue }) => {
    try {
        const { data } = await API.get('/products/featured');
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch featured products');
    }
});

export const fetchCategories = createAsyncThunk('products/fetchCategories', async (_, { rejectWithValue }) => {
    try {
        const { data } = await API.get('/products/categories');
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
    }
});

export const fetchBrands = createAsyncThunk('products/fetchBrands', async (_, { rejectWithValue }) => {
    try {
        const { data } = await API.get('/products/brands');
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch brands');
    }
});

const productSlice = createSlice({
    name: 'products',
    initialState: {
        products: [],
        product: null,
        featuredProducts: [],
        categories: [],
        brands: [],
        totalProducts: 0,
        totalPages: 0,
        currentPage: 1,
        loading: false,
        detailLoading: false,
        error: null,
    },
    reducers: {
        clearProductDetail: (state) => {
            state.product = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload.products || [];
                state.totalProducts = action.payload.totalProducts || 0;
                state.totalPages = action.payload.totalPages || 0;
                state.currentPage = action.payload.currentPage || 1;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchProductDetail.pending, (state) => {
                state.detailLoading = true;
            })
            .addCase(fetchProductDetail.fulfilled, (state, action) => {
                state.detailLoading = false;
                state.product = action.payload.product;
            })
            .addCase(fetchProductDetail.rejected, (state, action) => {
                state.detailLoading = false;
                state.error = action.payload;
            })
            .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
                state.featuredProducts = action.payload.products || [];
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.categories = action.payload.categories || [];
            })
            .addCase(fetchBrands.fulfilled, (state, action) => {
                state.brands = action.payload.brands || [];
            });
    },
});

export const { clearProductDetail, clearError } = productSlice.actions;
export default productSlice.reducer;
