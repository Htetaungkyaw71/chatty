import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { loadState } from "./localstorage";

// Define a service using a base URL and expected endpoints
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
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetAllContactQuery } = contactServices;
