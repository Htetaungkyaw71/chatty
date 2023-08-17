import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { loadState } from "./localstorage";

export const contactServices = createApi({
  reducerPath: "contactServices",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      const user = loadState();
      headers.set("Authorization", `Bearer ${user.token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getAllContact: builder.query({
      query: () => "contact",
    }),
    addContact: builder.mutation({
      query: ({
        otherUserId,
        otherUserName,
        otherUserEmail,
        otherUserAvater,
      }) => ({
        url: "contact",
        method: "POST",
        body: {
          otherUserId,
          otherUserName,
          otherUserEmail,
          otherUserAvater,
        },
      }),
      transformResponse: (response) => response,
    }),
  }),
});

export const { useGetAllContactQuery, useAddContactMutation } = contactServices;
