// src/config/api.js

// Get the base URL from environment variables
// This should be defined in .env.development as: VITE_BASE_URL=http://localhost:8080
const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8080';

export const API_ENDPOINTS = {
  // Health check endpoint
  SERVER_STATUS: () => `${BASE_URL}/api/is_server_active`,
  
  // Get latest posts with pagination
  POSTS_LATEST: (limit = 20, offset = 0) => 
    `${BASE_URL}/api/posts/latest?limit=${limit}&offset=${offset}`,
  
  // Search posts by keyword
  SEARCH_POSTS: (query, limit = 10, offset = 0) => 
    `${BASE_URL}/api/posts/search?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`,
  
  // (NEW) Filter posts by one or more tags using the new endpoint
  FILTER_POSTS_BY_TAGS: (tags, limit = 20, offset = 0) => 
    `${BASE_URL}/api/posts/filter?tags=${encodeURIComponent(tags)}&limit=${limit}&offset=${offset}`,
  
  // Get single post by ID
  POST_BY_ID: (id) => `${BASE_URL}/api/posts/${id}`,
  
  // Get all available tags
  TAGS_AVAILABLE: () => `${BASE_URL}/api/tags/available`,
};

// Export the base URL for use in other utilities (like image URL resolution)
export { BASE_URL };