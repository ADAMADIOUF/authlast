import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_URL } from '../constants'

// Set up a base query that includes credentials for all requests
const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: 'include', // Ensure cookies are included in every request
})

export const apiSlice = createApi({
  reducerPath: 'api', // Unique name for the API slice
  baseQuery,
  tagTypes: ['Blog', 'User', 'Wishlist', 'Comment'], // Define the tags for cache management
  endpoints: (builder) => ({
    // Define your endpoints here (can be extended from another slice like usersApiSlice)
  }),
})

export default apiSlice
