import { combineReducers, configureStore } from "@reduxjs/toolkit";
// import { userReducer } from "./reducers/user";
import UserReducer from "./reducers/userSlice";
import ShopReducer from "./reducers/shopSlice";
import ProductReducer from "./reducers/productSlice";
import EventReducer from "./reducers/eventSlice";
import CartReducer from "./reducers/cartSlice";
import WishReducer from "./reducers/wishSlice";
import OrderReducer from "./reducers/orderSlice";

import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

const rootReducer = combineReducers({
  user: UserReducer,
  shop: ShopReducer,
  product: ProductReducer,
  event: EventReducer,
  cart: CartReducer,
  wish: WishReducer,
  order: OrderReducer,
});

const persistConfig = {
  key: "root",
  storage,
  version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
export const persistor = persistStore(store);
