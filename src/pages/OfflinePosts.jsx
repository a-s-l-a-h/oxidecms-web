import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { Link } from 'preact-router';
import { useStore } from '../store/store';
import { PostListItem } from '../components/PostListItem';
import { Icons } from '../components/Icons';

export const OfflinePosts = () => {
  const { offlinePosts, loadOfflinePosts } = useStore();
  
  useEffect(() => {
    loadOfflinePosts();
  }, []);
  
  return (
    <div class="container mx-auto px-4 py-8 max-w-7xl">
      <div class="mb-8">
        <Link
          href="/"
          class="flex items-center space-x-2 text-purple-600 dark:text-purple-400 hover:underline mb-6 transition-colors group"
        >
          <Icons.ArrowLeft class="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>
        
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Offline Posts
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Read your saved posts anytime, even without internet
        </p>
      </div>
      
      {offlinePosts.length === 0 ? (
        <div class="glass-card rounded-2xl p-12 text-center">
          <Icons.Book class="w-20 h-20 mx-auto text-gray-400 dark:text-gray-600 mb-6" />
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            No Offline Posts Yet
          </h2>
          <p class="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Save posts for offline reading by clicking the download icon on any post. 
            They'll appear here for easy access.
          </p>
          <Link
            href="/"
            class="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
            Browse Posts
          </Link>
        </div>
      ) : (
        <>
          <div class="mb-6 flex items-center justify-between">
            <p class="text-gray-600 dark:text-gray-400">
              {offlinePosts.length} {offlinePosts.length === 1 ? 'post' : 'posts'} saved
            </p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offlinePosts.map((post, index) => (
              <div key={post.id} class="animate-slideUp" style={`animation-delay: ${index * 0.05}s`}>
                <PostListItem post={post} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};