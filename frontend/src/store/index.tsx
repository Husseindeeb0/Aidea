import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../states/auth/authSlice';
import categoryReducer from '../states/category/categorySlice';
import requestReducer from '../states/request/requestSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
    request: requestReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;