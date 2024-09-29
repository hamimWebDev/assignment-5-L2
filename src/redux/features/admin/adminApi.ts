import { baseApi } from "../../api/baseApi";

const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUser: builder.query({
      query: () => ({
        url: `/auth/users`,
        method: "GET",
      }),
      providesTags: ["user"],
    }),
    getUser: builder.query({
      query: (userId) => ({
        url: `/auth/user/${userId}`,
      }),
      providesTags: ["user"],
    }),
    deleteUser: builder.mutation<void, string>({
      query: (userId) => ({
        url: `/auth/user/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["user"],
    }),
    updateUser: builder.mutation({
      query: ({ userId, userData }) => ({
        url: `/auth/user/${userId}`,
        method: "PUT",
        body: userData,
      }),
      invalidatesTags: ["user"],
    }),
    getAllBookings: builder.query({
      query: () => ({
        url: `/bookings`,
        method: "GET",
      }),
      providesTags: ["user"],
    }),
    addFaculties: builder.mutation({
      query: (bookingData) => ({
        url: `facility`,
        method: "POST",
        body: bookingData,
      }),
      invalidatesTags: ["user"],
    }),
    getAllFaculties: builder.query({
      query: () => ({
        url: `/facility`,
        method: "GET",
      }),
      providesTags: ["user"],
    }),
    getAFaculty: builder.query({
      query: (userId) => ({
        url: `/facility/${userId}`,
        method: "GET",
      }),
      providesTags: ["user"],
    }),
    updateFaculty: builder.mutation({
      query: ({ facultyId, facultyData }) => ({
        url: `/facility/${facultyId}`,
        method: "PUT",
        body: facultyData,
      }),
      invalidatesTags: ["user"],
    }),
    deleteFaculty: builder.mutation<void, string>({
      query: (userId) => ({
        url: `/facility/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["user"],
    }),
    getABooking: builder.query({
      query: (userId) => ({
        url: `/bookings/${userId}`,
        method: "GET",
      }),
      providesTags: ["user"],
    }),
  }),
});

export const {
  useGetUserQuery,
  useGetAllUserQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useGetAllBookingsQuery,
  useGetABookingQuery,
  useAddFacultiesMutation,
  useGetAllFacultiesQuery,
  useGetAFacultyQuery,
  useDeleteFacultyMutation,
  useUpdateFacultyMutation,
} = adminApi;
