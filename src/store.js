import { configureStore } from "@reduxjs/toolkit";
import { userServices } from "./redux/userServices";
import { contactServices } from "./redux/contactServices";
import { messageServices } from "./redux/messageServices";

export const store = configureStore({
  reducer: {
    [userServices.reducerPath]: userServices.reducer,
    [contactServices.reducerPath]: contactServices.reducer,
    [messageServices.reducerPath]: messageServices.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      userServices.middleware,
      contactServices.middleware,
      messageServices.middleware,
    ]),
});
