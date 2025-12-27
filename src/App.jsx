import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import Router from 'preact-router';
import { createHashHistory } from 'history';
import { useStore } from './store/store';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { SearchOverlay } from './components/SearchOverlay';
import { Home } from './pages/Home';
import { PostDetail } from './pages/PostDetail';
import { OfflinePosts } from './pages/OfflinePosts';
import { Settings } from './pages/Settings';
import { About } from './pages/About';

const history = createHashHistory();

export function App() {
  const { 
    initTheme, 
    loadFilterPreferences,
    loadOfflinePosts,
    setCurrentPath
  } = useStore();
  
  useEffect(() => {
    // Initialize app
    initTheme();
    loadFilterPreferences();
    loadOfflinePosts();
  }, []);
  
  const handleRouteChange = (e) => {
    setCurrentPath(e.url);
  };

  return (
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Sidebar />
      <SearchOverlay />
      <Header />
      
      <main class="min-h-[calc(100vh-4rem)]">
        <Router history={history} onChange={handleRouteChange}>
          <Home path="/" />
          <PostDetail path="/posts/:postId" />
          <OfflinePosts path="/offline" />
          <Settings path="/settings" />
          <About path="/about" />
        </Router>
      </main>
      
      {/*<footer class="bg-white dark:bg-gray-800 border-t dark:border-gray-700 py-8 mt-16">
        <div class="container mx-auto px-4 text-center">
          <p class="text-gray-600 dark:text-gray-400 text-sm">
            😊
          </p>
          <p class="text-gray-500 dark:text-gray-500 text-xs mt-2">
            Made with love for makers and learners
          </p>
        </div>
      </footer>*/}
    </div>
  );
}