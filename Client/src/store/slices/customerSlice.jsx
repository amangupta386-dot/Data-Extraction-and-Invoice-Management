import { createSlice } from "@reduxjs/toolkit";

const customersSlice = createSlice({
  name: "customers",
  initialState: null,
  reducers: {
    /**
     * Set the list of customers.
     * @param {Object} state - The current state of the slice.
     * @param {Object} action - The action payload containing customers.
     */
    setCustomers: (state, action) => {
      return { ...state, ...action.payload };
    },

    /**
     * Update a specific customer by their ID.
     * @param {Object} state - The current state of the slice.
     * @param {Object} action - The action payload with `id` and `data`.
     */
    updateCustomer: (state, action) => {
      const index = state.items.findIndex((customer) => customer.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload.data };
        state.lastUpdated = new Date().toISOString();
      } else {
        console.error(`Customer with ID ${action.payload.id} not found.`);
      }
    },

    /**
     * Clear the customer list and reset state.
     * Useful for clearing data when switching contexts.
     */
    resetCustomers: (state) => {
      state.items = [];
      state.lastUpdated = null;
    },
  },
});

export const { setCustomers, updateCustomer, resetCustomers } = customersSlice.actions;
export default customersSlice.reducer;
