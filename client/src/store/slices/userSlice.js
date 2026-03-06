import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

export const fetchAllUsers = createAsyncThunk('users/fetchAll', async (params = {}, { rejectWithValue }) => {
    try {
        const queryString = new URLSearchParams(params).toString();
        const { data } = await API.get(`/users?${queryString}`);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
});

export const updateUserRole = createAsyncThunk('users/updateRole', async ({ id, role }, { rejectWithValue }) => {
    try {
        const { data } = await API.put(`/users/${id}/role`, { role });
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update user role');
    }
});

const userSlice = createSlice({
    name: 'users',
    initialState: {
        users: [],
        totalUsers: 0,
        totalPages: 0,
        loading: false,
        updatingId: null,
        error: null,
    },
    reducers: {
        clearUserError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload.users;
                state.totalUsers = action.payload.total;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(fetchAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateUserRole.pending, (state, action) => {
                state.updatingId = action.meta.arg.id;
            })
            .addCase(updateUserRole.fulfilled, (state, action) => {
                state.updatingId = null;
                const index = state.users.findIndex(u => u._id === action.payload.user._id);
                if (index !== -1) {
                    state.users[index] = action.payload.user;
                }
            })
            .addCase(updateUserRole.rejected, (state, action) => {
                state.updatingId = null;
                state.error = action.payload;
            });
    },
});

export const { clearUserError } = userSlice.actions;
export default userSlice.reducer;
