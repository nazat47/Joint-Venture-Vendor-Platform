import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  error: null,
  loading: true,
  currentShop: null,
  allShops: null,
};

const shopSlice = createSlice({
  name: "Shop",
  initialState: initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.loading = false;
      state.currentShop = action.payload;
      state.isAuthenticated = true;
    },
    signInFailure: (state, action) => {
      state.isAuthenticated = false;
      state.loading = false;
      state.error = action.payload;
    },
    signOutSuccess: (state, action) => {
      state.loading = false;
      state.currentShop = null;
      state.isAuthenticated = false;
      state.error = false;
    },
    getAllShops: (state, action) => {
      state.loading = false;
      state.allShops = action.payload;
    },
    getAllShopsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});
export default shopSlice.reducer;

export const {
  getAllShopsFailure,
  getAllShops,
  signOutSuccess,
  signInFailure,
  signInStart,
  signInSuccess,
} = shopSlice.actions;
