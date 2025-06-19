import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import forgotPasswordReducer from './slices/forgotPasswordSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        forgotPassword: forgotPasswordReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Prevents errors with non-serializable values (useful for tokens)
        }),
    devTools: process.env.NODE_ENV !== 'production', // Enable Redux DevTools only in development
});

export default store;
