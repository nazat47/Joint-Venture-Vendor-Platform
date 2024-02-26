import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  currentProducts: null,
  allProducts: null,
  shopAllProducts: null,
  success: false,
  error: null,
};

const productSlice = createSlice({
  name: "Products",
  initialState: initialState,
  reducers: {
    ProductRequest: (state) => {
      state.loading = true;
    },
    createProductSuccess: (state, action) => {
      state.loading = false;
      state.currentProducts = action.payload;
      state.error = null;
      state.success = true;
    },
    ProductFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
    getAllProducts: (state, action) => {
      state.loading = false;
      state.allProducts = action.payload;
      state.error = null;
    },
    deleteProduct: (state, action) => {
      state.loading = false;
      state.shopAllProducts = state.shopAllProducts.filter(
        (prod) => prod._id !== action.payload
      );
      state.error = null;
      state.success = true;
    },
    getShopAllProducts: (state, action) => {
      state.loading = false;
      state.shopAllProducts = action.payload;
      state.error = null;
      state.success = true;
    },
  },
});

export const {
  deleteProduct,
  ProductRequest,
  ProductFailure,
  createProductSuccess,
  getAllProducts,
  getShopAllProducts,
} = productSlice.actions;

export default productSlice.reducer;
