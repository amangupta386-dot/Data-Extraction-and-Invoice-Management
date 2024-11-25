
// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import invoicesReducer from './slices/invoiceSlice';
import productsReducer from './slices/productSlice';
import customersReducer from './slices/customerSlice';

export const store = configureStore({
  reducer: {
    invoices: invoicesReducer,
    products: productsReducer,
    customers: customersReducer,
  },
});

