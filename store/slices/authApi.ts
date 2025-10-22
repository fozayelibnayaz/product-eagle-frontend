import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND,
    credentials: "include"
  }),
  endpoints: (build) => ({
    login: build.mutation<{ username: string }, { username: string, password: string }>({
      query: (body) => ({
        url: "/api/auth/login",
        method: "POST",
        body
      })
    }),
    logout: build.mutation<void, void>({
      query: () => ({
        url: "/api/auth/logout",
        method: "POST"
      })
    }),
    productStatus: build.query<{ counts: Record<string, number> }, void>({
      query: () => "/api/analytics/product-status"
    })
  })
});

export const { useLoginMutation, useLogoutMutation, useProductStatusQuery } = authApi;
