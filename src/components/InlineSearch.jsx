// src/components/InlineSearch.jsx

import { h } from 'preact';
import { useStore } from '../store/store';
import { Icons } from './Icons';

export const InlineSearch = () => {
  const { 
    isInlineSearchVisible, 
    searchQuery, 
    setSearchQuery,
    setSubmittedQuery,
    closeInlineSearch,
  } = useStore();

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    // Submit the query for searching as the user types (debounced in the store)
    setSubmittedQuery(value);
  };

  const handleClear = () => {
    setSearchQuery('');
    setSubmittedQuery('');
  };

  if (!isInlineSearchVisible) {
    return null;
  }

  return (
    <div class="sticky top-16 z-30 mb-8 animate-fadeIn">
      <div class="container mx-auto max-w-7xl px-4">
        <div class="relative glass-card rounded-2xl shadow-2xl border-2 border-purple-200 dark:border-purple-800 overflow-hidden">
          <input
            type="text"
            value={searchQuery}
            onInput={handleInputChange}
            placeholder="Search all posts..."
            class="w-full pl-14 pr-16 py-5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-lg outline-none border-none"
            autoFocus
          />
          <div class="absolute left-4 top-1/2 -translate-y-1/2 text-purple-600 dark:text-purple-400">
            <Icons.Search class="w-6 h-6" />
          </div>
          <div class="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {searchQuery && (
              <button
                onClick={handleClear}
                class="p-2 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all text-gray-500 dark:text-gray-400"
                aria-label="Clear search"
              >
                <Icons.X class="w-5 h-5" />
              </button>
            )}
            <button
              onClick={closeInlineSearch}
              class="p-2 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all text-gray-500 dark:text-gray-400"
              aria-label="Close search"
            >
              <Icons.ChevronRight class="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};