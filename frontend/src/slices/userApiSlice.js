import { USERS_URL } from '../constants'
import { apiSlice } from './apiSlice'

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/login`,
        method: 'POST',
        body: data,
        credentials: 'include', // Include credentials for login
      }),
      invalidatesTags: ['User'], // Invalidate user data after login
    }),
    loginGoogle: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/auth/google/`,
        method: 'GET',
        credentials: 'include', // Include credentials for Google login
      }),
      invalidatesTags: ['User'], // Invalidate user data after Google login
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/register`,
        method: 'POST',
        body: data,
        credentials: 'include', // Include credentials for registration
      }),
      invalidatesTags: ['User'], // Invalidate user data after registration
    }),
    logout: builder.mutation({
      // Accept token as an argument
      query: (token) => ({
        url: `${USERS_URL}/logout`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
      }),
      invalidatesTags: ['User'],
    }),
    profile: builder.query({
      query: () => ({
        url: `${USERS_URL}/profile`,
        method: 'GET',
        credentials: 'include', // Include credentials when fetching profile
      }),
      providesTags: ['User'], // Provide user tag for caching
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: 'PUT',
        body: data,
        credentials: 'include', // Include credentials for updating profile
      }),
      invalidatesTags: ['User'], // Invalidate user data after profile update
    }),
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/forgot-password`,
        method: 'POST',
        body: data,
        credentials: 'include', // Include credentials for forgot password
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ token, password }) => ({
        url: `${USERS_URL}/reset-password/${token}`,
        method: 'PUT',
        body: { password },
        credentials: 'include', // Include credentials for reset password
      }),
    }),
    getUsers: builder.query({
      query: () => ({
        url: USERS_URL,
        credentials: 'include', // Include credentials when fetching all users
      }),
      providesTags: ['Users'], // Provide tag for users list caching
      keepUnusedDataFor: 5,
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
        method: 'DELETE',
        credentials: 'include', // Include credentials for deleting a user
      }),
      invalidatesTags: ['Users'], // Invalidate users list after deletion
    }),
    getUserDetails: builder.query({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
        credentials: 'include', // Include credentials for getting user details
      }),
      providesTags: ['User'], // Provide user tag for caching
      keepUnusedDataFor: 5,
    }),
  }),
})

export const {
  useLoginMutation,
  useLoginGoogleMutation,
  useLogoutMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useProfileQuery,
  useUpdateProfileMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
  useGetUserDetailsQuery,
} = usersApiSlice
