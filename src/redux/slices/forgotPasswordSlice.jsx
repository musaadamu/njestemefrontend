import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Send password reset email
export const sendResetEmail = createAsyncThunk(
    'auth/forgotPassword',
    async (email, { rejectWithValue }) => {
        try {
            console.log('Sending password reset email to:', email);
            const response = await api.auth.forgotPassword(email);
            console.log('Password reset response:', response.data);
            return response.data.message;
        } catch (error) {
            console.error('Password reset error:', error);
            return rejectWithValue(error.response?.data?.message || 'Failed to send reset link');
        }
    }
);

// Reset password with new credentials
export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async ({ token, password }, { rejectWithValue }) => {
        try {
            console.log('Resetting password with token:', token);
            const response = await api.auth.resetPassword(token, password);
            console.log('Password reset response:', response.data);
            return response.data.message;
        } catch (error) {
            console.error('Password reset error:', error);
            return rejectWithValue(error.response?.data?.message || 'Failed to reset password');
        }
    }
);

const forgotPasswordSlice = createSlice({
    name: 'forgotPassword',
    initialState: { message: null, error: null, loading: false },
    reducers: {
        clearMessages: (state) => {
            state.message = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendResetEmail.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(sendResetEmail.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload;
            })
            .addCase(sendResetEmail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearMessages } = forgotPasswordSlice.actions;
export default forgotPasswordSlice.reducer;
