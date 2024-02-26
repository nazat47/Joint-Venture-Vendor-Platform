import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [],
};

const cartSlice = createSlice({
  name: "Cart",
  initialState: initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const itemExist = state.cart.find((i) => i._id === item._id);
      if (itemExist) {
        return {
          ...state,
          cart: state.cart.map((i) => (i._id === itemExist._id ? item : i)),
        };
      } else {
        return {
          ...state,
          cart: [...state.cart, item],
        };
      }
    },
    emptyCart: (state, action) => {
      state.cart = [];
    },
    removeFromCart: (state, action) => {
      return {
        ...state,
        cart: state.cart.filter((item) => item._id !== action.payload._id),
      };
    },
  },
});

export const { emptyCart, addToCart, removeFromCart } = cartSlice.actions;

export default cartSlice.reducer;
