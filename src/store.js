import { configureStore } from "@reduxjs/toolkit";
import { userServices } from "./redux/userServices";
import { contactServices } from "./redux/contactServices";

export const store = configureStore({
  reducer: {
    [userServices.reducerPath]: userServices.reducer,
    [contactServices.reducerPath]: contactServices.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      userServices.middleware,
      contactServices.middleware,
    ]),
});
