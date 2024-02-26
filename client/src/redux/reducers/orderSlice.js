import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  currentOrder: null,
  allOrders: null,
  shopAllOrders: null,
  error: null,
};

const orderSlice = createSlice({
  name: "Orders",
  initialState: initialState,
  reducers: {
    OrderRequest: (state) => {
      state.loading = true;
    },
    createOrderSuccess: (state, action) => {
      state.loading = false;
      state.currentOrder = action.payload;
      state.error = null;
    },
    OrderFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getAllOrders: (state, action) => {
      state.loading = false;
      state.allOrders = action.payload;
      state.error = null;
    },
    deleteOrder: (state, action) => {
      state.loading = false;
      state.allOrders = state.allOrders.filter(
        (order) => order._id !== action.payload
      );
      state.error = null;
    },
    getShopAllOrders: (state, action) => {
      state.loading = false;
      state.shopAllOrders = action.payload;
      state.error = null;
    },
  },
});

export const {
  deleteOrder,
  OrderRequest,
  OrderFailure,
  createOrderSuccess,
  getAllOrders,
  getShopAllOrders,
} = orderSlice.actions;

export default orderSlice.reducer;
