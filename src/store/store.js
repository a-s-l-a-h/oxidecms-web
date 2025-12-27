import { create } from 'zustand';
import { apiService } from '../services/api';
import { offlineOperations, settingsOperations } from '../services/db';

export const useStore = create((set, get) => ({
  // ========== UI STATE ==========
  theme: 'dark',
  isSidebarOpen: false,
  isSearchOpen: false,
  currentPath: '/',
  
  // ========== POSTS STATE ==========
  posts: [],
  latestPosts: [],
  isLoading: false,
  hasMore: true,
  error: null,
  currentPage: 0,
  
  // ========== SEARCH STATE ==========
  searchQuery: '',
  submittedQuery: '',
  searchResults: [],
  isSearching: false,
  searchError: null,
  searchPage: 0,
  hasMoreSearch: true,
  searchCache: {},
  
  // ========== FILTER STATE ==========
  availableTags: [],
  selectedTags: new Set(['All']),
  rememberFilter: false,
  tagsLoaded: false,
  
  // ========== OFFLINE STATE ==========
  offlinePosts: [],
  isServerOnline: true,
  
  // ========== THEME ACTIONS ==========
  initTheme: () => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    set({ theme: savedTheme });
  },
  
  toggleTheme: () => {
    const newTheme = get().theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    set({ theme: newTheme });
  },
  
  // ========== UI ACTIONS ==========
  toggleSidebar: () => set(state => ({ isSidebarOpen: !state.isSidebarOpen })),
  closeSidebar: () => set({ isSidebarOpen: false }),
  toggleSearch: () => set(state => ({ isSearchOpen: !state.isSearchOpen })),
  closeSearch: () => set({ isSearchOpen: false, searchQuery: '', submittedQuery: '', searchResults: [] }),
  setCurrentPath: (path) => set({ currentPath: path }),

  // ========== POSTS ACTIONS (REFACTORED) ==========
  fetchLatestPostsSlider: async () => {
    if (get().latestPosts.length > 0) return;
    try {
      const latestRes = await apiService.getLatestPosts(5, 0);
      set({ latestPosts: (latestRes.data || []).slice(0, 5) });
    } catch (e) {
      console.error("Failed to fetch latest posts for slider", e);
    }
  },

  fetchInitialPosts: async () => {
    set({ isLoading: true, error: null, currentPage: 0, posts: [] });
    const { selectedTags } = get();
    const tagsToFilter = [...selectedTags].filter(t => t !== 'All');

    try {
      let postsRes;
      if (tagsToFilter.length > 0) {
        console.log(`🔍 Filtering by tags: ${tagsToFilter.join(', ')}`);
        postsRes = await apiService.filterPostsByTags(tagsToFilter, 20, 0);
      } else {
        postsRes = await apiService.getLatestPosts(20, 0);
      }
      
      const posts = postsRes.data || [];
      
      set({ 
        posts,
        isLoading: false,
        hasMore: posts.length === 20,
        currentPage: 1,
        isServerOnline: !postsRes.fromCache,
        error: postsRes.error,
      });
      
    } catch (error) {
      console.error('Fetch initial error:', error);
      set({ 
        isLoading: false, 
        error: error.message,
        isServerOnline: false
      });
    }
  },
  
  fetchNextPage: async () => {
    const { isLoading, hasMore, posts, currentPage, selectedTags } = get();
    if (isLoading || !hasMore) return;
    
    set({ isLoading: true });
    const tagsToFilter = [...selectedTags].filter(t => t !== 'All');

    try {
      const offset = currentPage * 20;
      let result;

      if (tagsToFilter.length > 0) {
        result = await apiService.filterPostsByTags(tagsToFilter, 20, offset);
      } else {
        result = await apiService.getLatestPosts(20, offset);
      }
      
      const newPosts = result.data || [];
      
      set({ 
        posts: [...posts, ...newPosts],
        isLoading: false,
        hasMore: newPosts.length === 20,
        currentPage: currentPage + 1
      });
    } catch (error) {
      console.error('Fetch next page error:', error);
      set({ isLoading: false, error: error.message });
    }
  },
  
  // ========== SEARCH ACTIONS (WITH CACHING) ==========
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  setSubmittedQuery: (query) => {
    set({ submittedQuery: query, searchPage: 0 });
    if (query) {
      get().searchPosts(query);
    } else {
      set({ searchResults: [], searchError: null });
    }
  },
  
  searchPosts: async (query) => {
    if (!query) {
      set({ searchResults: [], submittedQuery: '' });
      return;
    }
    
    const { searchCache } = get();
    
    if (searchCache[query]) {
      console.log(`✅ Using cached search results for "${query}"`);
      set({ 
        searchResults: searchCache[query],
        isSearching: false,
        hasMoreSearch: searchCache[query].length === 10,
        searchPage: 1
      });
      return;
    }
    
    set({ isSearching: true, searchError: null, searchPage: 0 });
    
    try {
      const results = await apiService.searchPosts(query, 10, 0);
      const newCache = { ...searchCache, [query]: results };
      
      set({ 
        searchResults: results,
        isSearching: false,
        hasMoreSearch: results.length === 10,
        searchPage: 1,
        searchCache: newCache
      });
      
      console.log(`✅ Fetched and cached search results for "${query}"`);
    } catch (error) {
      console.error('Search error:', error);
      set({ isSearching: false, searchError: error.message });
    }
  },
  
  // ========== TAGS ACTIONS (OPTIMIZED) ==========
  fetchTags: async () => {
    const { tagsLoaded, availableTags } = get();
    if (tagsLoaded && availableTags.length > 0) {
      console.log('✅ Using cached tags (no server request)');
      return;
    }
    
    try {
      const tags = await apiService.getAvailableTags();
      await settingsOperations.set('tags', tags);
      set({ availableTags: tags, tagsLoaded: true });
      console.log('✅ Fetched tags from server');
    } catch (error) {
      console.error('Fetch tags error:', error);
      const cached = await settingsOperations.get('tags');
      if (cached) {
        set({ availableTags: cached, tagsLoaded: true });
        console.log('✅ Using cached tags from IndexedDB');
      }
    }
  },
  
  applyFilters: (tagsToApply) => {
    const newTags = new Set(tagsToApply);
    if (newTags.size === 0) {
        newTags.add('All');
    }
    set({ selectedTags: newTags });
    if (get().rememberFilter) {
      localStorage.setItem('selectedTags', JSON.stringify([...newTags]));
    }
    // The explicit call has been removed.
  },
  
  toggleTag: (tag) => {
    const { selectedTags, rememberFilter } = get();
    const newTags = new Set(selectedTags);
    
    if (tag === 'All') {
      newTags.clear();
      newTags.add('All');
    } else {
      newTags.delete('All');
      if (newTags.has(tag)) {
        newTags.delete(tag);
      } else {
        newTags.add(tag);
      }
      if (newTags.size === 0) newTags.add('All');
    }
    
    set({ selectedTags: newTags });
    
    if (rememberFilter) {
      localStorage.setItem('selectedTags', JSON.stringify([...newTags]));
    }
    get().fetchInitialPosts();
  },
  
  clearFilters: () => {
    set({ selectedTags: new Set(['All']) });
    if (get().rememberFilter) {
      localStorage.setItem('selectedTags', JSON.stringify(['All']));
    }
    get().fetchInitialPosts();
  },
  
  loadFilterPreferences: () => {
    const remember = localStorage.getItem('rememberFilter') === 'true';
    set({ rememberFilter: remember });
    
    if (remember) {
      const saved = localStorage.getItem('selectedTags');
      if (saved) {
        try {
          set({ selectedTags: new Set(JSON.parse(saved)) });
        } catch (e) {
          console.error('Failed to parse saved tags:', e);
        }
      }
    }
  },
  
  // --- THIS IS THE CORRECTED FUNCTION ---
  // It now ONLY manages the rememberFilter flag and does NOT
  // prematurely save the tags to local storage.
  setRememberFilter: (value) => {
    localStorage.setItem('rememberFilter', value);
    set({ rememberFilter: value });

    // The logic to save/remove tags has been removed from here.
    // It correctly lives inside applyFilters, clearFilters, and toggleTag.
    if (!value) {
      localStorage.removeItem('selectedTags');
    }
  },
  
  // ========== OFFLINE ACTIONS ==========
  loadOfflinePosts: async () => {
    const posts = await offlineOperations.getAll();
    set({ offlinePosts: posts });
  },
  
  toggleOffline: async (post) => {
    const { offlinePosts } = get();
    const isOffline = offlinePosts.some(p => p.id === post.id);
    
    if (isOffline) {
      await offlineOperations.remove(post.id);
      set({ offlinePosts: offlinePosts.filter(p => p.id !== post.id) });
    } else {
      let fullPost = post;
      if (!post.content) {
        try {
          fullPost = await apiService.getPostById(post.id);
        } catch (e) {
          console.error('Failed to fetch full post:', e);
        }
      }
      await offlineOperations.add(fullPost);
      set({ offlinePosts: [...offlinePosts, fullPost] });
    }
  },
  
  // ========== CACHE ACTIONS ==========
  clearCache: async () => {
    const { cacheOperations } = await import('../services/db');
    await cacheOperations.clearPostsCache();
    await cacheOperations.clearVisitedPosts();
    set({ 
      posts: [], 
      latestPosts: [], 
      searchCache: {},
      tagsLoaded: false
    });
    console.log('🗑️ Cache cleared');
  },
  
  clearOfflineCache: async () => {
    await offlineOperations.clear();
    set({ offlinePosts: [] });
    console.log('🗑️ Offline posts cleared');
  },
}));