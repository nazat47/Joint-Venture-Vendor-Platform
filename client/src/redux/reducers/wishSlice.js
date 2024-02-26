import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    wish: localStorage.getItem("wishItems")
    ? JSON.parse(localStorage.getItem("wishItems"))
    : [],
};

const wishSlice = createSlice({
  name: "WishList",
  initialState: initialState,
  reducers: {
    addToWishList: (state, action) => {
      const item = action.payload;
      const itemExist = state.wish.find((i) => i._id === item._id);
      if (itemExist) {
        return {
          ...state,
          wish: state.wish.map((i) =>
            i._id === itemExist._id ? item : i
          ),
        };
      } else {
        return {
          ...state,
          wish: [...state.wish, item],
        };
      }
    },
    removeFromWishList: (state, action) => {
      return {
        ...state,
        wish: state.wish.filter((item) => item._id !== action.payload._id),
      };
    },
  },
});

export const { addToWishList, removeFromWishList } = wishSlice.actions;

export default wishSlice.reducer;
