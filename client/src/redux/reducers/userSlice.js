import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  error: null,
  loading: false,
  currentUser: null,
  addressLoading: false,
  allUsers: null,
};

const userSlice = createSlice({
  name: "User",
  initialState: initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.loading = false;
      state.currentUser = action.payload;
      state.isAuthenticated = true;
    },
    signInFailure: (state, action) => {
      state.isAuthenticated = false;
      state.loading = false;
      state.error = action.payload;
    },
    signOutSuccess: (state, action) => {
      state.loading = false;
      state.currentUser = null;
      state.isAuthenticated = false;
      state.error = false;
    },
    updateStart: (state) => {
      state.loading = true;
    },
    updateAddressStart: (state) => {
      state.addressLoading = true;
    },
    updateSuccess: (state, action) => {
      state.loading = false;
      state.currentUser = action.payload;
    },
    updateAddressFailure: (state, action) => {
      state.addressLoading = false;
      state.error = action.payload;
    },
    updateFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteUserAddressSuccess: (state, action) => {
      state.addressLoading = false;
      state.currentUser = action.payload;
      state.error = null;
    },
    getAllUsers: (state, action) => {
      state.loading = false;
      state.allUsers = action.payload;
    },
  },
});
export default userSlice.reducer;

export const {
  getAllUsers,
  deleteUserAddressSuccess,
  updateAddressStart,
  updateAddressFailure,
  updateSuccess,
  updateFailure,
  updateStart,
  signOutSuccess,
  signInFailure,
  signInStart,
  signInSuccess,
} = userSlice.actions;
