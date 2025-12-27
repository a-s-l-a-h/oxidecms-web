// File: src/components/SearchOverlay.jsx

import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { Link } from 'preact-router';
import { useStore } from '../store/store';
import { Icons } from './Icons';

export const SearchOverlay = () => {
  const { 
    isSearchOpen, 
    closeSearch,
    searchQuery, 
    setSearchQuery,
    submittedQuery,
    setSubmittedQuery,
    searchResults,
    isSearching,
  } = useStore();
  
  const [localQuery, setLocalQuery] = useState('');
  
useEffect(() => {
    // Set up a timer to run after 1 second (1000ms) of inactivity.
    const timer = setTimeout(() => {
      const trimmedQuery = localQuery.trim();

      // --- TECHNIQUE IMPLEMENTED HERE ---
      // 1. Check if the query has a meaningful length (e.g., 3+ characters).
      // 2. This prevents requests for very short or empty queries.
      if (trimmedQuery.length >= 3) {
        // If the condition is met, submit the query to trigger the search.
        setSubmittedQuery(trimmedQuery);
      } else {
        // If the query is too short, ensure we clear any previous search results.
        // This is good practice to avoid showing stale results.
        setSubmittedQuery(''); 
      }
    }, 500); // Wait for 1 second after the user stops typing.

    // --- CLEANUP FUNCTION ---
    // This function runs every time the user types a new letter.
    // It cancels the previous timer, so a new 1-second countdown begins.
    return () => clearTimeout(timer);

  }, [localQuery, setSubmittedQuery]);
  
  const handleInputChange = (e) => {
    const value = e.target.value;
    setLocalQuery(value);
    setSearchQuery(value);
  };
  
  const handleClose = () => {
    setLocalQuery('');
    setSearchQuery('');
    setSubmittedQuery('');
    closeSearch();
  };
  
  if (!isSearchOpen) return null;
  
  return (
    // FIXED: Added light mode background, dark mode now uses the dark: prefix
    <div class="fixed inset-0 bg-gray-100 dark:bg-gradient-to-br dark:from-black dark:via-purple-950 dark:to-blue-950 z-50 p-4 md:p-8 animate-fadeIn overflow-y-auto backdrop-blur-xl">
      <div class="max-w-4xl mx-auto">
        {/* Header */}
        <div class="flex items-center justify-between mb-8 animate-slideUp">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl border-4 border-white dark:border-white/20">
              <Icons.Search class="w-8 h-8 text-white" />
            </div>
            <div>
              {/* FIXED: Added light mode text colors */}
              <h2 class="text-4xl font-bold text-gray-900 dark:text-white">Search Posts</h2>
              <p class="text-purple-600 dark:text-purple-200 mt-1">Find exactly what you're looking for</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            // FIXED: Added light/dark mode styles for button
            class="p-4 rounded-2xl bg-white dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition-all duration-300 text-gray-800 dark:text-white border border-gray-200 dark:border-white/20 hover:border-gray-300 dark:hover:border-white/40 backdrop-blur-md active:scale-90"
            aria-label="Close search"
          >
            <Icons.X class="w-6 h-6" />
          </button>
        </div>
        
        {/* Search Input */}
        <div class="relative mb-10 animate-slideUp" style="animation-delay: 0.1s">
          {/* FIXED: Used glass-card for better consistency, it handles both modes */}
          <div class="relative glass-card rounded-2xl shadow-2xl border-2 border-gray-200 dark:border-white/20 overflow-hidden">
            <input
              type="text"
              value={localQuery}
              onInput={handleInputChange}
              placeholder="Search by title, tags, or content..."
              // FIXED: Added light mode text and placeholder colors
              class="w-full pl-16 pr-6 py-6 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-purple-200 text-xl outline-none border-none"
              autoFocus
            />
            {/* FIXED: Added light mode icon color */}
            <div class="absolute left-5 top-1/2 -translate-y-1/2 text-purple-600 dark:text-purple-300">
              <Icons.Search class="w-7 h-7" />
            </div>
            {localQuery && (
              <button
                onClick={() => {
                  setLocalQuery('');
                  setSearchQuery('');
                  setSubmittedQuery('');
                }}
                // FIXED: Added light mode colors
                class="absolute right-5 top-1/2 -translate-y-1/2 p-2 rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 transition-all text-gray-500 dark:text-purple-200 hover:text-gray-800 dark:hover:text-white"
              >
                <Icons.X class="w-5 h-5" />
              </button>
            )}
          </div>
          
          {/* Search Stats */}
          {submittedQuery && !isSearching && (
            <div class="mt-4 text-center">
              {/* FIXED: Added light mode text color */}
              <p class="text-gray-600 dark:text-purple-200 text-sm font-medium">
                {searchResults.length > 0 
                  ? `Found ${searchResults.length} ${searchResults.length === 1 ? 'result' : 'results'} for "${submittedQuery}"`
                  : `No results for "${submittedQuery}"`
                }
              </p>
            </div>
          )}
        </div>
        
        {/* Search Results */}
        <div class="space-y-4">
          {isSearching && (
            <div class="text-center py-16 animate-slideUp">
              {/* FIXED: Added light/dark backgrounds */}
              <div class="w-20 h-20 mx-auto mb-6 bg-gray-200 dark:bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border-4 border-gray-300 dark:border-white/20">
                <div class="spinner w-12 h-12 border-4 border-purple-600 dark:border-purple-400 border-t-transparent rounded-full"></div>
              </div>
              {/* FIXED: Added light mode text colors */}
              <p class="text-2xl text-gray-900 dark:text-white font-bold mb-2">Searching...</p>
              <p class="text-gray-600 dark:text-purple-200">Finding the best matches for you</p>
            </div>
          )}
          
          {!isSearching && submittedQuery && searchResults.length === 0 && (
            <div class="text-center py-16 animate-slideUp">
              {/* FIXED: Consistent styling with the loader */}
              <div class="w-24 h-24 mx-auto mb-6 bg-gray-200 dark:bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border-4 border-gray-300 dark:border-white/20">
                <Icons.Search class="w-12 h-12 text-purple-500 dark:text-purple-300" />
              </div>
              {/* FIXED: Added light mode text colors */}
              <h3 class="text-3xl font-bold text-gray-900 dark:text-white mb-3">No results found</h3>
              <p class="text-gray-600 dark:text-purple-200 text-lg mb-6">
                We couldn't find anything matching "{submittedQuery}"
              </p>
              <p class="text-gray-500 dark:text-purple-300 text-sm">
                Try different keywords or browse all posts
              </p>
            </div>
          )}
          
          {searchResults.map((post, index) => (
            <Link
              key={post.id}
              href={`/posts/${post.id}`}
              onClick={handleClose}
              // FIXED: Corrected hover states for light mode
              class="w-full block glass-card bg-white dark:bg-white/10 hover:bg-gray-50 dark:hover:bg-white/20 rounded-2xl transition-all duration-300 text-left group border-2 border-gray-200 dark:border-white/10 hover:border-purple-400 dark:hover:border-white/30 shadow-xl hover:shadow-2xl card-reveal"
              style={`animation-delay: ${index * 0.05}s`}
            >
              <div class="p-6">
                {/* FIXED: Added light mode text colors */}
                <h3 class="font-bold text-2xl mb-3 text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r from-purple-600 to-pink-600 dark:group-hover:from-purple-300 dark:group-hover:to-pink-300 transition-all duration-300 flex items-center gap-3">
                  {post.title}
                  <Icons.ChevronRight class="w-5 h-5 text-gray-400 dark:text-purple-300 transform group-hover:translate-x-2 transition-transform duration-300" />
                </h3>
                
                {/* FIXED: Added light mode text colors */}
                <p class="text-base text-gray-600 dark:text-purple-100 line-clamp-2 mb-4 leading-relaxed">
                  {post.summary}
                </p>
                
                {post.tags && post.tags.length > 0 && (
                  <div class="flex flex-wrap gap-2">
                    {post.tags.slice(0, 4).map((tag, idx) => (
                      <span 
                        key={idx}
                        // FIXED: Added light mode tag styles
                        class="px-3 py-1.5 text-xs font-bold rounded-full bg-gray-200 text-gray-700 dark:bg-white/20 dark:text-white border border-gray-300 dark:border-white/30 group-hover:bg-gray-300 dark:group-hover:bg-white/30 transition-all duration-300"
                      >
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > 4 && (
                      <span class="px-3 py-1.5 text-xs font-bold rounded-full bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-purple-200">
                        +{post.tags.length - 4} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
        
        {/* Quick Tips */}
        {!submittedQuery && !isSearching && (
          // The glass-card class already handles both themes perfectly
          <div class="mt-12 glass-card rounded-2xl p-8 border-2 border-gray-200 dark:border-white/20 animate-slideUp" style="animation-delay: 0.2s">
            {/* FIXED: Added light mode text colors */}
            <h4 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
              <svg class="w-6 h-6 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Search Tips
            </h4>
            {/* FIXED: Added light mode text colors */}
            <ul class="space-y-3 text-gray-600 dark:text-purple-100">
              <li class="flex items-start gap-3">
                <span class="text-purple-500 dark:text-purple-400 font-bold">•</span>
                <span>Use specific keywords for better results</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="text-purple-500 dark:text-purple-400 font-bold">•</span>
                <span>Search by tags to find related content</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="text-purple-500 dark:text-purple-400 font-bold">•</span>
                <span>Try shorter queries for broader results</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};