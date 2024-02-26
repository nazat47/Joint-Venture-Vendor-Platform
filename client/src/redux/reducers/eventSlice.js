import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  currentEvent: null,
  allEvents: null,
  shopAllEvents: null,
  success: false,
  error: null,
};

const eventSlice = createSlice({
  name: "Events",
  initialState: initialState,
  reducers: {
    EventRequest: (state) => {
      state.loading = true;
    },
    createEventSuccess: (state, action) => {
      state.loading = false;
      state.currentEvent = action.payload;
      state.error = null;
      state.success = true;
    },
    EventFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
    getAllEvents: (state, action) => {
      state.loading = false;
      state.allEvents = action.payload;
      state.error = null;
      state.success = true;
    },
    getShopAllEvents: (state, action) => {
      state.loading = false;
      state.shopAllEvents = action.payload;
      state.error = null;
      state.success = true;
    },
    deleteEvent: (state, action) => {
      state.loading = false;
      state.shopAllEvents = state.shopAllEvents.filter(
        (event) => event._id !== action.payload
      );
      state.error = null;
      state.success = true;
    },
  },
});

export const {
  deleteEvent,
  EventRequest,
  EventFailure,
  createEventSuccess,
  getAllEvents,
  getShopAllEvents,
} = eventSlice.actions;

export default eventSlice.reducer;
