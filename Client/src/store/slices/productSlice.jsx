import { createSlice } from "@reduxjs/toolkit";

const productsSlice = createSlice({
  name: "products",
  initialState: null,
  reducers: {
    /**
     * Set the list of products.
     * @param {Object} state - The current state of the slice.
     * @param {Object} action - The action payload containing products.
     */
    setProducts: (state, action) => {
      return { ...state, ...action.payload };
    },

    /**
     * Update a specific product by its ID.
     * @param {Object} state - The current state of the slice.
     * @param {Object} action - The action payload with `id` and `data`.
     */
    updateProduct: (state, action) => {
      const index = state.items.findIndex((product) => product.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload.data };
        state.lastUpdated = new Date().toISOString();
      } else {
        console.error(`Product with ID ${action.payload.id} not found.`);
      }
    },

    /**
     * Clear the product list and reset state.
     * Useful for clearing data when switching contexts.
     */
    resetProducts: (state) => {
      state.items = [];
      state.lastUpdated = null;
    },
  },
});

export const { setProducts, updateProduct, resetProducts } = productsSlice.actions;
export default productsSlice.reducer;
