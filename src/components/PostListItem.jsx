import { h } from 'preact';
import { Link } from 'preact-router';
import { useStore } from '../store/store';
import { resolveImageUrl, getTagColor } from '../utils/helpers';
import { Icons } from './Icons';

export const PostListItem = ({ post, showDownloadIcon = true }) => {
  const { offlinePosts, toggleOffline } = useStore();
  const isOffline = offlinePosts.some(p => p.id === post.id);
  
  const handleOfflineToggle = (e) => {
    e.stopPropagation();
    e.preventDefault();
    toggleOffline(post);
  };
  
  return (
    <Link href={`/posts/${post.id}`} class="block h-full">
      <div class="glass-card rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 group border-2 border-gray-200 dark:border-gray-800 hover:border-purple-400 dark:hover:border-purple-600 glow-effect h-full flex flex-col">
        {/* Image Section - Fixed height */}
        <div class="w-full block relative group/image h-56 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 flex-shrink-0">
          {post.coverImage ? (
            <>
              <img 
                src={resolveImageUrl(post.coverImage)} 
                alt={post.title}
                width="400" 
                height="225"
                loading="lazy"
                class="w-full h-full object-cover transition-transform duration-500 group-hover/image:scale-105"
              />
              
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover/image:opacity-80 transition-opacity duration-500"></div>
              
              <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-all duration-500 backdrop-blur-sm">
                <div class="bg-white/90 dark:bg-gray-900/90 px-6 py-3 rounded-full font-bold text-purple-600 dark:text-purple-400 shadow-2xl transform scale-90 group-hover/image:scale-100 transition-transform duration-500 flex items-center gap-2 border-2 border-purple-400">
                  Read Article
                  <Icons.ChevronRight class="w-5 h-5" />
                </div>
              </div>
            </>
          ) : (
            <div class="w-full h-full flex items-center justify-center">
              <div class="text-center px-6">
                <div class="w-16 h-16 mx-auto mb-3 bg-white/50 dark:bg-gray-800/50 rounded-full flex items-center justify-center">
                  <Icons.Book class="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <p class="text-sm font-semibold text-purple-600 dark:text-purple-400">No Cover Image</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Content Section */}
        <div class="p-6 flex-1 flex flex-col">
          <div class="w-full text-left flex-1">
            <h2 class="text-2xl font-bold mb-3 text-gray-900 dark:text-white line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-300">
              {post.title}
            </h2>
            
            <p class="text-gray-600 dark:text-gray-400 text-base mb-4 line-clamp-3 leading-relaxed">
              {post.summary}
            </p>
          </div>
          
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div class="flex flex-wrap gap-2 mb-5">
              {post.tags.slice(0, 3).map((tag, idx) => (
                <span 
                  key={idx} 
                  class={`px-3 py-1.5 text-xs font-bold rounded-full ${getTagColor(idx)} transition-all duration-300 hover:scale-110 cursor-pointer`}
                >
                  {tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span class="px-3 py-1.5 text-xs font-bold rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                  +{post.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};