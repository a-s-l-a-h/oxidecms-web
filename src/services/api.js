// src/services/api.js

import { API_ENDPOINTS } from '../config/api';
import { cacheOperations } from './db';

/**
 * Transforms object keys from snake_case to camelCase recursively.
 * @param {any} obj The object to transform.
 * @returns {any} The transformed object.
 */
const toCamelCase = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(v => toCamelCase(v));
  } else if (obj !== null && typeof obj === 'object' && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = key.replace(/([-_][a-z])/ig, ($1) => {
        return $1.toUpperCase().replace('-', '').replace('_', '');
      });
      result[camelKey] = toCamelCase(obj[key]);
      return result;
    }, {});
  }
  return obj;
};

/**
 * Flattens and enriches the post data from API response.
 * - Moves all properties from nested 'metadata' to top level
 * - Adds default 'author' field if missing
 * - Ensures all required fields are present
 * @param {Array|Object} data Post data from API.
 * @returns {Array|Object} Flattened and enriched post data.
 */
const flattenAndEnrichPosts = (data) => {
  const processPost = (post) => {
    if (!post) return post;
    
    let processedPost = { ...post };
    
    // Flatten metadata
    if (processedPost.metadata) {
      const { metadata, ...rest } = processedPost;
      processedPost = { ...rest, ...metadata };
    }
    
    // Add default author if not present
    if (!processedPost.author) {
      processedPost.author = 'Admin';
    }
    
    // Ensure tags is always an array
    if (!processedPost.tags) {
      processedPost.tags = [];
    }
    
    return processedPost;
  };
  
  if (Array.isArray(data)) {
    return data.map(processPost);
  }
  
  return processPost(data);
};

class ApiService {
  async fetchWithCache(url, cacheKey) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const rawData = await response.json();
      
      // Step 1: Transform snake_case to camelCase
      let data = toCamelCase(rawData);
      
      // Step 2: Flatten metadata and enrich posts
      data = flattenAndEnrichPosts(data);

      if (cacheKey) {
        await cacheOperations.cachePosts(Array.isArray(data) ? data : [data]);
      }
      
      return { data, error: null, fromCache: false };
    } catch (error) {
      console.error('Fetch error:', error);
      const cached = await cacheOperations.getAllPosts();
      return { 
        data: cached, 
        error: error.message, 
        fromCache: true 
      };
    }
  }

  async getLatestPosts(limit = 20, offset = 0) {
    return this.fetchWithCache(API_ENDPOINTS.POSTS_LATEST(limit, offset), 'posts');
  }

  async getPostById(id) {
    try {
      const response = await fetch(API_ENDPOINTS.POST_BY_ID(id));
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const rawData = await response.json();
      
      let data = toCamelCase(rawData);
      data = flattenAndEnrichPosts(data);
      
      return data;
    } catch (error) {
      console.error('Fetch post error:', error);
      throw error;
    }
  }

  async searchPosts(query, limit = 10, offset = 0) {
    try {
      const response = await fetch(API_ENDPOINTS.SEARCH_POSTS(query, limit, offset));
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const rawData = await response.json();
      
      let data = toCamelCase(rawData);
      data = flattenAndEnrichPosts(data);
      
      return data;
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  }
  
  async filterPostsByTags(tags = [], limit = 20, offset = 0) {
    const tagsString = tags.join(',');
    const url = API_ENDPOINTS.FILTER_POSTS_BY_TAGS(tagsString, limit, offset);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        if (response.status === 400) {
          const errorText = await response.text();
          throw new Error(`Bad Request: ${errorText}`);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const rawData = await response.json();
      
      let data = toCamelCase(rawData);
      data = flattenAndEnrichPosts(data);
      
      return { data, error: null, fromCache: false };
    } catch (error) {
      console.error('Filter posts by tags error:', error);
      return { data: [], error: error.message, fromCache: false };
    }
  }

  async getAvailableTags() {
    try {
      const response = await fetch(API_ENDPOINTS.TAGS_AVAILABLE());
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Fetch tags error:', error);
      return [];
    }
  }

  async checkServerStatus() {
    try {
      const response = await fetch(API_ENDPOINTS.SERVER_STATUS(), { 
        method: 'GET'
      });
      return response.ok && response.status === 200;
    } catch (error) {
      return false;
    }
  }
}

export const apiService = new ApiService();