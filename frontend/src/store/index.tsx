import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../states/auth/authSlice';
import categoryReducer from '../states/category/categorySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;