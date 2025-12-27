import { h } from 'preact';
import { Link, route } from 'preact-router';
import { useStore } from '../store/store';
import { Icons } from './Icons';

export const Header = () => {
  const { theme, toggleTheme, toggleSidebar, toggleSearch, currentPath } = useStore();
  
  const isHomePage = currentPath === '/';

  const handleLeftIconClick = () => {
    if (isHomePage) {
      // If on the home page, open the sidebar.
      toggleSidebar();
    } else {
      // If on another page, check the history length.
      // If there's no meaningful back history (i.e., user landed here directly),
      // navigate to the home page.
      if (window.history.length <= 2) {
        route('/', true); // The `true` replaces the current URL in history.
      } else {
        // Otherwise, go back normally.
        window.history.back();
      }
    }
  };

  return (
    <header class="sticky top-0 z-40 backdrop-blur-strong bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 dark:from-indigo-900 dark:via-purple-900 dark:to-indigo-950 shadow-2xl border-b border-white/10">
      <div class="absolute inset-0 bg-gradient-mesh opacity-20"></div>
      
      <nav class="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between relative">
        <div class="flex items-center space-x-4">
          <button
            onClick={handleLeftIconClick}
            class="group p-2.5 rounded-xl text-white hover:bg-white/20 transition-all duration-300 active:scale-95 backdrop-blur-sm border border-white/10 hover:border-white/30"
            aria-label={isHomePage ? 'Open menu' : 'Go back'}
          >
            {isHomePage ? (
              <Icons.Menu class="transform group-hover:scale-110 transition-transform duration-300" />
            ) : (
              <Icons.ArrowLeft class="transform group-hover:scale-110 transition-transform duration-300" />
            )}
          </button>
          
          <Link
            href="/"
            class="group flex items-center px-4 py-2 rounded-xl hover:bg-white/10 transition-all duration-300 backdrop-blur-sm border border-transparent hover:border-white/20"
          >
            <span class="text-2xl font-bold text-white tracking-tight group-hover:tracking-wide transition-all duration-300">
              ibtwil blogs
            </span>
          </Link>
        </div>
        
        <div class="flex items-center space-x-2">
          <button
            onClick={toggleSearch}
            class="group p-2.5 rounded-xl text-white hover:bg-white/20 transition-all duration-300 active:scale-95 backdrop-blur-sm border border-white/10 hover:border-white/30"
            aria-label="Search"
          >
            <Icons.Search class="transform group-hover:rotate-90 transition-transform duration-300" />
          </button>
          
          <button
            onClick={toggleTheme}
            class="group p-2.5 rounded-xl text-white hover:bg-white/20 transition-all duration-300 active:scale-95 backdrop-blur-sm border border-white/10 hover:border-white/30"
            aria-label="Toggle theme"
          >
            <div class="relative">
              {theme === 'dark' ? (
                <Icons.Sun class="transform group-hover:rotate-180 transition-transform duration-500" />
              ) : (
                <Icons.Moon class="transform group-hover:-rotate-12 transition-transform duration-300" />
              )}
            </div>
          </button>
        </div>
      </nav>
      
      {/* Bottom glow effect */}
      <div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
    </header>
  );
};