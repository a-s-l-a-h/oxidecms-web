import { h } from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks';
import { useStore } from '../store/store';
import { LatestPostsSlider } from '../components/LatestPostsSlider';
import { PostListItem } from '../components/PostListItem';
import { FilterDialog } from '../components/FilterDialog';
import { Icons } from '../components/Icons';

export const Home = () => {
  const { 
    posts,
    isLoading, 
    hasMore, 
    error,
    fetchInitialPosts,
    fetchNextPage,
    fetchTags,
    fetchLatestPostsSlider,
    selectedTags,
    toggleTag,
    isServerOnline
  } = useStore();
  
  const [isFilterOpen, setFilterOpen] = useState(false);
  const observerTarget = useRef(null);
  
  // Initial load for static/once-off data
  useEffect(() => {
    fetchLatestPostsSlider();
    fetchTags();
  }, []);

  // Effect to re-fetch the main post list whenever the filters change
  useEffect(() => {
    fetchInitialPosts();
  }, [selectedTags]);
  
  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          fetchNextPage();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );
    
    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }
    
    return () => observer.disconnect();
  }, [hasMore, isLoading]);
  
  const isAllActive = selectedTags.has('All') || selectedTags.size === 0;
  const isFilterActive = !isAllActive;
  
  return (
    <div class="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50/20 dark:from-gray-900 dark:via-purple-950/20 dark:to-blue-950/10">
      <div class="container mx-auto px-3 md:px-6 py-6 md:py-8 max-w-7xl">
        {/* Server Status Indicator */}
        {!isServerOnline && (
          <div class="mb-6 p-5 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl flex items-center space-x-4 shadow-lg animate-slideUp backdrop-blur-sm">
            <div class="p-3 bg-red-100 dark:bg-red-900/50 rounded-xl">
              <Icons.CloudOff class="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div class="flex-1">
              <p class="font-bold text-red-900 dark:text-red-200 text-lg">Offline Mode</p>
              <p class="text-sm text-red-700 dark:text-red-300">
                You're viewing cached content. Some features may be limited.
              </p>
            </div>
          </div>
        )}
        
        {/* Latest Posts Slider */}
        <LatestPostsSlider />
        
        {/* Filter Section */}
        <div class="mb-8 animate-slideUp" style="animation-delay: 0.2s">
          <div class="glass-card rounded-2xl p-6 shadow-xl">
            <div class="flex items-center justify-between mb-4">            
            </div>
            
            <div class="flex items-center space-x-3 flex-wrap gap-3">
              <button
                onClick={() => setFilterOpen(true)}
                class={`group flex items-center space-x-3 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 border-2 ${
                  isFilterActive
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-transparent shadow-purple-500/50'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-600'
                }`}
              >
                <Icons.Filter class={`w-5 h-5 transition-transform duration-300 ${isFilterActive ? 'rotate-180' : 'group-hover:rotate-180'}`} />
                <span>Filter by Tags</span>
                {isFilterActive && (
                  <span class="ml-2 px-3 py-1 bg-white/30 backdrop-blur-sm rounded-full text-sm font-bold">
                    {selectedTags.size}
                  </span>
                )}
              </button>
              
              <button
                onClick={() => toggleTag('All')}
                class={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 border-2 ${
                  isAllActive
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-transparent shadow-blue-500/50'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600'
                }`}
              >
                All Posts
              </button>
            </div>
          </div>
        </div>
        
        {/* Posts Grid */}
        {isLoading && posts.length === 0 ? (
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} class="card-reveal" style={`animation-delay: ${i * 0.1}s`}>
                <div class="glass-card rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-800">
                  <div class="skeleton h-56 rounded-t-2xl"></div>
                  <div class="p-6 space-y-4">
                    <div class="skeleton h-7 w-3/4 rounded-lg"></div>
                    <div class="skeleton h-4 w-full rounded-lg"></div>
                    <div class="skeleton h-4 w-5/6 rounded-lg"></div>
                    <div class="flex gap-2 mt-4">
                      <div class="skeleton h-7 w-20 rounded-full"></div>
                      <div class="skeleton h-7 w-24 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error && posts.length === 0 ? (
          <div class="glass-card rounded-2xl p-16 text-center shadow-2xl animate-slideUp">
            <div class="w-24 h-24 mx-auto mb-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <Icons.CloudOff class="w-12 h-12 text-red-500 dark:text-red-400" />
            </div>
            <h3 class="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Unable to load posts
            </h3>
            <p class="text-gray-600 dark:text-gray-400 mb-8 text-lg max-w-md mx-auto">
              {error}
            </p>
            <button
              onClick={fetchInitialPosts}
              class="btn-primary px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-2xl active:scale-95 text-lg"
            >
              Try Again
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div class="glass-card rounded-2xl p-16 text-center shadow-2xl animate-slideUp">
            <div class="w-24 h-24 mx-auto mb-6 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
              <Icons.Filter class="w-12 h-12 text-purple-500 dark:text-purple-400" />
            </div>
            <h3 class="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              No posts found
            </h3>
            <p class="text-gray-600 dark:text-gray-400 mb-8 text-lg max-w-md mx-auto">
              Try adjusting your filters to see more content
            </p>
            <button
              onClick={() => toggleTag('All')}
              class="btn-primary px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-2xl active:scale-95 text-lg"
            >
              Show All Posts
            </button>
          </div>
        ) : (
          <>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {posts.map((post, index) => (
                <div key={post.id} class="card-reveal" style={`animation-delay: ${(index % 6) * 0.05}s`}>
                  <PostListItem post={post} />
                </div>
              ))}
            </div>
            
            {/* Loading more indicator */}
            <div ref={observerTarget} class="py-12">
              {isLoading && hasMore && (
                <div class="flex justify-center">
                  <div class="glass-card px-8 py-4 rounded-full shadow-xl border-2 border-purple-200 dark:border-purple-800 flex items-center space-x-4">
                    <div class="spinner w-6 h-6 border-3 border-purple-600 border-t-transparent rounded-full"></div>
                    <span class="text-gray-700 dark:text-gray-300 font-semibold text-lg">Loading more amazing posts...</span>
                  </div>
                </div>
              )}

            </div>
          </>
        )}
        
        {/* Filter Dialog */}
        <FilterDialog isOpen={isFilterOpen} onClose={() => setFilterOpen(false)} />
      </div>
    </div>
  );
};