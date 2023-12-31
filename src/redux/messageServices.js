import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { loadState } from "./localstorage";

export const messageServices = createApi({
  reducerPath: "messageServices",
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
    getAllMessage: builder.query({
      query: ({ roomId }) => `messages/${roomId}`,
    }),
    addMessage: builder.mutation({
      query: ({ text, roomId }) => ({
        url: "message",
        method: "POST",
        body: {
          text,
          roomId,
        },
      }),
      transformResponse: (response) => response,
    }),
    updateMessage: builder.mutation({
      query: ({ id, text }) => ({
        url: `message/${id}`,
        method: "PUT",
        body: {
          text,
        },
      }),
      transformResponse: (response) => response,
    }),
    deleteMessage: builder.mutation({
      query: ({ id }) => ({
        url: `message/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response) => response,
    }),
    updateIndicator: builder.mutation({
      query: ({ id }) => ({
        url: `indicator/${id}`,
        method: "PUT",
      }),
      transformResponse: (response) => response,
    }),
  }),
});

export const {
  useGetAllMessageQuery,
  useAddMessageMutation,
  useDeleteMessageMutation,
  useUpdateMessageMutation,
  useUpdateIndicatorMutation,
} = messageServices;
