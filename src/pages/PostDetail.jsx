// File: src/pages/PostDetail.jsx

import { h } from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks';
import { useStore } from '../store/store';
import { apiService } from '../services/api';
import { cacheOperations } from '../services/db';
import { formatDate, resolveMarkdownImageUrls } from '../utils/helpers';
import { Icons } from '../components/Icons';

export const PostDetail = ({ postId }) => {
  const { offlinePosts, toggleOffline, posts } = useStore();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const viewerRef = useRef(null);
  const viewerInstanceRef = useRef(null);

  // Checks if the current post is saved offline
  const isOffline = offlinePosts.some(p => p.id === postId);

  // Effect to load the post when the component mounts or postId changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    loadPost();

    // Cleanup function to destroy the Toast UI viewer instance
    return () => {
      if (viewerInstanceRef.current) {
        viewerInstanceRef.current.destroy();
        viewerInstanceRef.current = null;
      }
    };
  }, [postId]);

  // Effect to render the markdown content when the post data is available
  useEffect(() => {
    if (post?.content && viewerRef.current && window.toastui) {
      if (viewerInstanceRef.current) {
        viewerInstanceRef.current.destroy();
      }
      
      viewerRef.current.innerHTML = '';

      const processedContent = resolveMarkdownImageUrls(post.content);
      
      viewerInstanceRef.current = new window.toastui.Editor({
        el: viewerRef.current,
        viewer: true,
        initialValue: processedContent,
        height: 'auto',
      });
    }
  }, [post?.content]);

  // Function to fetch the post from cache or network
  const loadPost = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Priority 1: Check fully-loaded offline posts
      const offlinePost = offlinePosts.find(p => p.id === postId);
      if (offlinePost?.content) {
        setPost(offlinePost);
        setIsLoading(false);
        return;
      }
      
      // Priority 2: Check visited posts cache
      const cachedPost = await cacheOperations.getVisitedPost(postId);
      if (cachedPost?.content) {
        setPost(cachedPost);
        setIsLoading(false);
        
        // Silently update in the background
        apiService.getPostById(postId)
          .then(freshPost => {
            setPost(freshPost);
            cacheOperations.cacheVisitedPost(freshPost);
          });
        return;
      }
      
      // Priority 3: Use summary from the main post list while loading full content
      const summaryPost = posts.find(p => p.id === postId);
      if (summaryPost) {
        setPost(summaryPost);
      }
      
      // Priority 4: Fetch from the server
      const fullPost = await apiService.getPostById(postId);
      setPost(fullPost);
      await cacheOperations.cacheVisitedPost(fullPost);
      
    } catch (err) {
      console.error('Failed to load post:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for the offline download icon
  const handleOfflineToggle = () => {
    if (post) {
      toggleOffline(post);
    }
  };

  // Handler for the share icon
  const handleShare = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.summary,
          url: window.location.href, // Shares the current page URL
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback for desktop or browsers that don't support the Web Share API
      alert('Share feature is not supported on this browser.');
    }
  };

  // Loading State UI
  if (isLoading && !post) {
    return (
      <div class="container mx-auto px-4 md:px-6 py-8 max-w-4xl">
        <div class="animate-pulse space-y-6">
          <div class="skeleton h-8 w-24 rounded-md"></div>
          <div class="skeleton h-12 w-3/4 rounded-md"></div>
          <div class="skeleton h-96 w-full rounded-2xl"></div>
        </div>
      </div>
    );
  }

  // Error State UI
  if (error && !post) {
    return (
      <div class="container mx-auto px-4 md:px-6 py-8 max-w-4xl text-center">
        <p class="text-red-500">Error loading post: {error}</p>
        <button onClick={loadPost} class="mt-4 text-purple-500 font-semibold">Try Again</button>
      </div>
    );
  }

  // Null state before first load
  if (!post) return null;

  // Format the display date
  const displayDate = post.lastUpdatedAt 
    ? `Updated: ${formatDate(post.lastUpdatedAt)}` 
    : `Published: ${formatDate(post.createdAt)}`;

  return (
    <article class="animate-slideUp">
          <header class="container mx-auto px-4 md:px-6 py-8 max-w-4xl">
            {/* Main container for the new layout */}
            <div>
              {/* 1. Date Display - Aligned to the top right */}
              <div class="flex justify-end mb-2">
                <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  <span class="whitespace-nowrap">{displayDate}</span>
                </div>
              </div>

              {/* 2. Post Title - Now sits below the date */}
              <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                {post.title}
              </h1>
              
              {/* 3. Action Buttons - Aligned to the bottom right */}
              <div class="flex justify-end items-center gap-2">
                <button
                  onClick={handleOfflineToggle}
                  disabled={!post?.content}
                  class="p-2 rounded-full transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
                  aria-label="Save for offline reading"
                >
                  <Icons.Download class={isOffline ? 'text-purple-600 dark:text-purple-400' : ''} />
                </button>
                
                <button
                  onClick={handleShare}
                  class="p-2 rounded-full transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                  aria-label="Share post"
                >
                  <Icons.Share />
                </button>
              </div>
            </div>
          </header>
      
      {/* Content Section */}
      <section class="bg-white dark:bg-gray-800">
        <div class="container mx-auto max-w-4xl">
          <div class="px-4 md:px-6 py-6 md:py-8">
            {post.content ? (
              <div ref={viewerRef} class="toast-ui-content-wrapper" />
            ) : (
              <div class="text-center py-12">
                <div class="spinner w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p class="text-gray-600 dark:text-gray-400">Loading content...</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </article>
  );
};