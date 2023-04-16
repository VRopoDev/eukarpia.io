import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8080/api" }),
  reducerPath: "api",
  tagTypes: [
    "Organisation",
    "Dashboard",
    "Users",
    "Fields",
    "Products",
    "Contacts",
    "Transactions",
    "Overview",
    "Daily",
    "Breakdown",
    "Devices",
    "IoT",
    "Commands",
    "Notifications",
  ],
  endpoints: (build) => ({
    /* Dashboard API */
    getDashboard: build.query({
      query: (token) => ({
        url: "/dashboard",
        method: "GET",
        headers: { "auth-token": token },
      }),
      providesTags: ["Dashboard"],
    }),

    /* Organisation API */
    // [GET]
    getOrganisation: build.query({
      query: (token) => ({
        url: "/organisation",
        method: "GET",
        headers: { "auth-token": token },
      }),
      providesTags: ["Organisation"],
    }),
    getOrgNotifications: build.query({
      query: (token) => ({
        url: "/organisation/notification",
        method: "GET",
        headers: { "auth-token": token },
      }),
      providesTags: ["Notifications"],
    }),
    // [PATCH]
    updateOrganisation: build.mutation({
      query: ({ token, body }) => ({
        url: `/organisation`,
        method: "PATCH",
        headers: { "Content-Type": "application/json", "auth-token": token },
        body,
      }),
      invalidatesTags: ["Organisation"],
    }),
    // [DELETE]
    deleteOrganisation: build.mutation({
      query: (token) => ({
        url: `/organisation`,
        method: "DELETE",
        headers: { "auth-token": token },
      }),
      invalidatesTags: ["Organisation"],
    }),
    deleteOrgNotification: build.mutation({
      query: ({ id, token }) => ({
        url: `/organisation/notification/${id}`,
        method: "DELETE",
        headers: { "auth-token": token },
      }),
      invalidatesTags: ["Notifications"],
    }),

    /* User API */
    // [GET]
    getUsers: build.query({
      query: (token) => ({
        url: "/user",
        method: "GET",
        headers: { "auth-token": token },
      }),
      providesTags: ["Users"],
    }),
    // [POST]
    addUser: build.mutation({
      query: ({ body, token }) => ({
        url: "/user",
        method: "POST",
        headers: { "Content-Type": "application/json", "auth-token": token },
        body,
      }),
      invalidatesTags: ["Users"],
    }),
    // [PATCH]
    updateUser: build.mutation({
      query: ({ id, token, body }) => ({
        url: `/user/${id}`,
        method: "PATCH",
        headers: { "Content-Type": "application/json", "auth-token": token },
        body,
      }),
      invalidatesTags: ["Users"],
    }),
    // [DELETE]
    deleteUser: build.mutation({
      query: ({ id, token }) => ({
        url: `/user/${id}`,
        method: "DELETE",
        headers: { "auth-token": token },
      }),
      invalidatesTags: ["Users"],
    }),

    /* Contact APIs */
    getContacts: build.query({
      query: (token) => ({
        url: "/contact",
        method: "GET",
        headers: { "auth-token": token },
      }),
      providesTags: ["Contacts"],
    }),
    // [POST]
    addContact: build.mutation({
      query: ({ body, token }) => ({
        url: "/contact",
        method: "POST",
        headers: { "Content-Type": "application/json", "auth-token": token },
        body,
      }),
      invalidatesTags: ["Contacts", "Dashboard"],
    }),
    // [PATCH]
    updateContact: build.mutation({
      query: ({ id, token, body }) => ({
        url: `/contact/${id}`,
        method: "PATCH",
        headers: { "Content-Type": "application/json", "auth-token": token },
        body,
      }),
      invalidatesTags: ["Contacts", "Dashboard"],
    }),
    // [DELETE]
    deleteContact: build.mutation({
      query: ({ id, token }) => ({
        url: `/contact/${id}`,
        method: "DELETE",
        headers: { "auth-token": token },
      }),
      invalidatesTags: ["Contacts", "Dashboard"],
    }),

    /* Field API */
    // [GET]
    getFields: build.query({
      query: (token) => ({
        url: "/field",
        method: "GET",
        headers: { "auth-token": token },
      }),
      providesTags: ["Fields"],
    }),
    getProducts: build.query({
      query: (token) => ({
        url: "/field/products",
        method: "GET",
        headers: { "auth-token": token },
      }),
      providesTags: ["Products"],
    }),
    // [POST]
    addField: build.mutation({
      query: ({ body, token }) => ({
        url: "/field",
        method: "POST",
        headers: { "Content-Type": "application/json", "auth-token": token },
        body,
      }),
      invalidatesTags: ["Fields", "Products"],
    }),
    // [PATCH]
    updateField: build.mutation({
      query: ({ id, token, body }) => ({
        url: `/field/${id}`,
        method: "PATCH",
        headers: { "Content-Type": "application/json", "auth-token": token },
        body,
      }),
      invalidatesTags: ["Fields", "Products"],
    }),
    // [DELETE]
    deleteField: build.mutation({
      query: ({ id, token }) => ({
        url: `/field/${id}`,
        method: "DELETE",
        headers: { "auth-token": token },
      }),
      invalidatesTags: ["Fields", "Products"],
    }),

    /* Transaction API */
    // [GET]
    getTransactions: build.query({
      query: ({ page, pageSize, sort, search, token }) => ({
        url: "/transaction",
        method: "GET",
        headers: { "Content-Type": "application/json", "auth-token": token },
        params: { page, pageSize, sort, search },
      }),
      providesTags: ["Transactions"],
    }),
    // [POST]
    addTransaction: build.mutation({
      query: ({ body, token }) => ({
        url: "/transaction",
        method: "POST",
        headers: { "Content-Type": "application/json", "auth-token": token },
        body,
      }),
      invalidatesTags: ["Transactions", "Overview", "Dashboard"],
    }),
    // [PATCH]
    updateTransaction: build.mutation({
      query: ({ id, token, body }) => ({
        url: `/transaction/${id}`,
        method: "PATCH",
        headers: { "Content-Type": "application/json", "auth-token": token },
        body,
      }),
      invalidatesTags: ["Transactions", "Overview", "Dashboard"],
    }),
    // [DELETE]
    deleteTransaction: build.mutation({
      query: ({ id, token }) => ({
        url: `/transaction/${id}`,
        method: "DELETE",
        headers: { "auth-token": token },
      }),
      invalidatesTags: ["Transactions", "Overview", "Dashboard"],
    }),

    /* Stat APIs*/
    getOverview: build.query({
      query: (token) => ({
        url: "/stat/overview",
        method: "GET",
        headers: { "Content-Type": "application/json", "auth-token": token },
      }),
      providesTags: ["Overview"],
    }),
    getDaily: build.query({
      query: (token) => ({
        url: "/stat/daily",
        method: "GET",
        headers: { "Content-Type": "application/json", "auth-token": token },
      }),
      providesTags: ["Daily"],
    }),
    getBreakdown: build.query({
      query: (token) => ({
        url: "/stat/breakdown",
        method: "GET",
        headers: { "Content-Type": "application/json", "auth-token": token },
      }),
      providesTags: ["Breakdown"],
    }),

    /* Device API */
    // [GET]
    getDevices: build.query({
      query: (token) => ({
        url: "/device",
        method: "GET",
        headers: { "auth-token": token },
      }),
      providesTags: ["Devices"],
    }),
    getIoT: build.query({
      query: (token) => ({
        url: "/device/iot",
        method: "GET",
        headers: { "auth-token": token },
      }),
      providesTags: ["IoT"],
    }),
    getCommands: build.query({
      query: (token) => ({
        url: "/device/command",
        method: "GET",
        headers: { "auth-token": token },
      }),
      providesTags: ["Commands"],
    }),
    // [POST]
    addDevice: build.mutation({
      query: ({ body, token }) => ({
        url: "/device",
        method: "POST",
        headers: { "Content-Type": "application/json", "auth-token": token },
        body,
      }),
      invalidatesTags: ["Devices"],
    }),
    addCommand: build.mutation({
      query: ({ body, token }) => ({
        url: "/device/command",
        method: "POST",
        headers: { "Content-Type": "application/json", "auth-token": token },
        body,
      }),
      invalidatesTags: ["Commands"],
    }),
    sendCommand: build.mutation({
      query: ({ id, token }) => ({
        url: `/device/send-command/${id}`,
        method: "POST",
        headers: { "Content-Type": "application/json", "auth-token": token },
      }),
    }),
    // [PATCH]
    updateDevice: build.mutation({
      query: ({ id, token, body }) => ({
        url: `/device/${id}`,
        method: "PATCH",
        headers: { "Content-Type": "application/json", "auth-token": token },
        body,
      }),
      invalidatesTags: ["Devices"],
    }),
    updateCommand: build.mutation({
      query: ({ id, token, body }) => ({
        url: `/device/command/${id}`,
        method: "PATCH",
        headers: { "Content-Type": "application/json", "auth-token": token },
        body,
      }),
      invalidatesTags: ["Commands"],
    }),
    // [DELETE]
    deleteDevice: build.mutation({
      query: ({ id, token }) => ({
        url: `/device/${id}`,
        method: "DELETE",
        headers: { "auth-token": token },
      }),
      invalidatesTags: ["Devices"],
    }),
    deleteCommand: build.mutation({
      query: ({ id, token }) => ({
        url: `/device/command/${id}`,
        method: "DELETE",
        headers: { "auth-token": token },
      }),
      invalidatesTags: ["Commands"],
    }),
  }),
});

export const {
  /* Organisation */
  useGetOrganisationQuery,
  useGetOrgNotificationsQuery,
  useUpdateOrganisationMutation,
  useDeleteOrganisationMutation,
  useDeleteOrgNotificationMutation,
  /* User */
  useGetUsersQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  /* Field */
  useGetFieldsQuery,
  useAddFieldMutation,
  useUpdateFieldMutation,
  useDeleteFieldMutation,
  /* Product */
  useGetProductsQuery,
  /* Contact */
  useGetContactsQuery,
  useAddContactMutation,
  useUpdateContactMutation,
  useDeleteContactMutation,
  /* Transaction */
  useGetTransactionsQuery,
  useAddTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
  /* Stats */
  useGetOverviewQuery,
  useGetDailyQuery,
  useGetBreakdownQuery,
  /* Dashboard */
  useGetDashboardQuery,
  /* Device */
  useGetDevicesQuery,
  useGetIoTQuery,
  useAddDeviceMutation,
  useUpdateDeviceMutation,
  useDeleteDeviceMutation,
  /* Commands */
  useGetCommandsQuery,
  useAddCommandMutation,
  useUpdateCommandMutation,
  useSendCommandMutation,
  useDeleteCommandMutation,
} = api;
