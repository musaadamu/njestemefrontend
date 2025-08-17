
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { tokenStorage, userStorage } from '../../utils/security';

// Retrieve token and user from secure storage if available
const storedToken = tokenStorage.get();
const storedUser = userStorage.get();

const initialState = {
    user: storedUser || null, // storedUser is already parsed by userStorage.get()
    token: storedToken || null,
    loading: false,
    error: null,
};

// We'll use the api service instead of creating a new axios instance
// This ensures we use the same base URL configuration for all API calls

// Async Thunk for registering a user
export const registerUser = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            console.log('Registering user with data:', userData);
            const response = await api.auth.register(userData);
            const { data } = response;
            console.log('Registration response:', data);

            // Ensure user data includes role
            const userWithRole = {
                ...data.user,
                role: data.user.role || userData.role || 'author' // Fallback to form data or default to author
            };

            tokenStorage.set(data.token);
            userStorage.set(userWithRole);

            return {
                ...data,
                user: userWithRole
            };
        } catch (error) {
            console.error('Registration error:', error);
            return rejectWithValue(error.response?.data?.message || 'Registration failed');
        }
    }
);

// Async Thunk for logging in a user
export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            console.log('Logging in with credentials:', credentials);
            const response = await api.auth.login(credentials);
            const { data } = response;
            console.log('Login response:', data);

            // Ensure user data includes role
            const userWithRole = {
                ...data.user,
                role: data.user.role || 'author' // Default to author if no role is provided
            };

            console.log('User with role:', userWithRole);

            tokenStorage.set(data.token);
            userStorage.set(userWithRole);

            return {
                ...data,
                user: userWithRole
            };
        } catch (error) {
            console.error('Login error:', error);
            return rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    }
);

// Async Thunk for updating user profile
export const updateUserProfile = createAsyncThunk(
    'auth/updateUserProfile',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await api.auth.updateProfile(userData);
            const { data } = response;
            userStorage.set(data);
            return data;
        } catch (error) {
            console.error('Profile update error:', error);
            return rejectWithValue(error.response?.data?.message || 'Profile update failed');
        }
    }
);

// Redux Slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout(state) {
            state.user = null;
            state.token = null;
            state.loading = false;
            state.error = null;
            tokenStorage.remove();
            userStorage.remove();
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.user = payload.user;
                state.token = payload.token;
            })
            .addCase(registerUser.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            })
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.user = payload.user;
                state.token = payload.token;
            })
            .addCase(loginUser.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            })
            .addCase(updateUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserProfile.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.user = payload;
            })
            .addCase(updateUserProfile.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            });
    }
});

// Export actions properly
export const { logout } = authSlice.actions;
export default authSlice.reducer;
