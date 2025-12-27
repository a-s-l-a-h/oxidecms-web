import { h } from 'preact';
import { useState } from 'preact/hooks';
import { Link } from 'preact-router';
import { useStore } from '../store/store';
import { Icons } from '../components/Icons';

export const Settings = () => {
  const { clearCache, clearOfflineCache } = useStore();
  const [isClearing, setIsClearing] = useState(false);
  const [clearSuccess, setClearSuccess] = useState(false);
  
  const handleClearCache = async () => {
    if (isClearing) return;
    
    const confirmed = confirm(
      'Are you sure you want to clear all cached data? This will remove visited posts cache but keep your offline posts.'
    );
    
    if (!confirmed) return;
    
    setIsClearing(true);
    try {
      await clearCache();
      setClearSuccess(true);
      setTimeout(() => setClearSuccess(false), 3000);
    } catch (error) {
      console.error('Clear cache error:', error);
      alert('Failed to clear cache. Please try again.');
    } finally {
      setIsClearing(false);
    }
  };
  
  const handleClearOffline = async () => {
    if (isClearing) return;
    
    const confirmed = confirm(
      'Are you sure you want to remove all offline posts? You can save them again later.'
    );
    
    if (!confirmed) return;
    
    setIsClearing(true);
    try {
      await clearOfflineCache();
      setClearSuccess(true);
      setTimeout(() => setClearSuccess(false), 3000);
    } catch (error) {
      console.error('Clear offline error:', error);
      alert('Failed to clear offline posts. Please try again.');
    } finally {
      setIsClearing(false);
    }
  };
  
  return (
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <Link
        href="/"
        class="flex items-center space-x-2 text-purple-600 dark:text-purple-400 hover:underline mb-6 transition-colors group"
      >
        <Icons.ArrowLeft class="group-hover:-translate-x-1 transition-transform" />
        <span>Back to Home</span>
      </Link>
      
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-8">Settings</h1>
      
      {clearSuccess && (
        <div class="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-center space-x-3 animate-slideUp">
          <Icons.Check class="w-6 h-6 text-green-600 dark:text-green-400" />
          <span class="text-green-900 dark:text-green-200 font-medium">
            Successfully cleared!
          </span>
        </div>
      )}
      
      <div class="space-y-4">
        {/* Clear Cache */}
        <div class="glass-card rounded-2xl p-6 hover:shadow-xl transition-shadow">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Clear Cache
              </h3>
              <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Remove cached posts and images to free up space. Your offline posts will not be affected.
              </p>
            </div>
            <button
              onClick={handleClearCache}
              disabled={isClearing}
              class="flex items-center space-x-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 disabled:cursor-not-allowed"
            >
              {isClearing ? (
                <>
                  <div class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Clearing...</span>
                </>
              ) : (
                <>
                  <Icons.Trash class="w-5 h-5" />
                  <span>Clear Cache</span>
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Clear Offline Posts */}
        <div class="glass-card rounded-2xl p-6 hover:shadow-xl transition-shadow">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Clear Offline Posts
              </h3>
              <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Remove all posts saved for offline reading. You can save them again anytime.
              </p>
            </div>
            <button
              onClick={handleClearOffline}
              disabled={isClearing}
              class="flex items-center space-x-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 disabled:cursor-not-allowed"
            >
              {isClearing ? (
                <>
                  <div class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Clearing...</span>
                </>
              ) : (
                <>
                  <Icons.Trash class="w-5 h-5" />
                  <span>Clear Offline</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Info Section */}
      <div class="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
        <div class="flex items-start space-x-3">
          <Icons.Info class="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 class="font-semibold text-blue-900 dark:text-blue-200 mb-1">
              About Cache
            </h4>
            <p class="text-sm text-blue-800 dark:text-blue-300">
              ibtwil caches posts and images locally to provide a faster experience and allow offline access. 
              Clearing the cache will remove temporary data but won't delete your saved offline posts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};