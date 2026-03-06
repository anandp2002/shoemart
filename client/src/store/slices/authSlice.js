import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';
import { toggleWishlist } from './wishlistSlice';

// Thunks
export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
    try {
        const { data } = await API.post('/auth/login', credentials);
        localStorage.setItem('token', data.token);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
});

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
    try {
        const { data } = await API.post('/auth/register', userData);
        localStorage.setItem('token', data.token);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
});

export const loadUser = createAsyncThunk('auth/loadUser', async (_, { rejectWithValue }) => {
    try {
        const { data } = await API.get('/auth/me');
        return data;
    } catch (error) {
        localStorage.removeItem('token');
        return rejectWithValue(error.response?.data?.message || 'Not authenticated');
    }
});

export const logoutUser = createAsyncThunk('auth/logout', async () => {
    await API.get('/auth/logout');
    localStorage.removeItem('token');
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (userData, { rejectWithValue }) => {
    try {
        const { data } = await API.put('/users/profile', userData);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Update failed');
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        token: localStorage.getItem('token'),
        isAuthenticated: false,
        loading: !!localStorage.getItem('token'),
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Register
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Load User
            .addCase(loadUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(loadUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
            })
            .addCase(loadUser.rejected, (state) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
            })
            // Logout
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
                state.loading = false;
            })
            // Update Profile
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.user = action.payload.user;
            })
            // Wishlist Toggle (cross-slice)
            .addCase(toggleWishlist.fulfilled, (state, action) => {
                if (state.user) {
                    state.user.wishlist = action.payload.wishlist;
                }
            });
    },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
