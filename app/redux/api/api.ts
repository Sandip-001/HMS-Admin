// app/redux/api/api.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const server = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:5000";

const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${server}/api/`,
    credentials: "include", // ✅ important for cookies
  }),
  tagTypes: [],

  endpoints: (builder) => ({

  }),
});

export default api;

export const {

} = api;
