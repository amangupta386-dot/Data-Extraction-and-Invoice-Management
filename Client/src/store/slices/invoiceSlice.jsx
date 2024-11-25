import { createSlice } from "@reduxjs/toolkit";

const invoiceSlice = createSlice({
  name: "invoices",
  initialState: null,
  reducers: {
    setInvoices: (state, action) => {
      return { ...state, ...action.payload };
    },
    updateInvoice: (state, action) => {
      if (action.payload.id && state.invoiceDetails[action.payload.id]) {
        state.invoiceDetails[action.payload.id] = {
          ...state.invoiceDetails[action.payload.id],
          ...action.payload.data,
        };
      }
    },
  },
});

export const { setInvoices, updateInvoice } = invoiceSlice.actions;
export default invoiceSlice.reducer;
