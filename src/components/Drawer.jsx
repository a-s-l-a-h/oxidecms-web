import { h } from 'preact';
import { Link } from 'preact-router';
import { useStore } from '../store/store';
import { Icons } from './Icons';

export const Drawer = () => {
  const { isDrawerOpen, toggleDrawer } = useStore();
  
  const menuItems = [
    { 
      icon: Icons.Book, 
      label: 'Offline Posts', 
      path: '/offline',
      gradient: 'from-purple-500 to-pink-500',
      hoverBg: 'hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30'
    },
    { 
      icon: Icons.Settings, 
      label: 'Settings', 
      path: '/settings',
      gradient: 'from-blue-500 to-cyan-500',
      hoverBg: 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-900/30 dark:hover:to-cyan-900/30'
    },
    { 
      icon: Icons.Info, 
      label: 'About', 
      path: '/about',
      gradient: 'from-green-500 to-emerald-500',
      hoverBg: 'hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 dark:hover:from-green-900/30 dark:hover:to-emerald-900/30'
    },
  ];
  
  return (
    <>
      {/* Overlay */}
      <div
        class={`fixed inset-0 bg-black/70 backdrop-blur-md z-50 transition-all duration-500 ${
          isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleDrawer}
      />
      
      {/* Drawer */}
      <div
        class={`fixed top-0 left-0 h-full w-80 bg-white dark:bg-gray-900 shadow-2xl z-50 transform transition-all duration-500 custom-scrollbar overflow-y-auto border-r border-gray-200 dark:border-gray-800 ${
          isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={`transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);`}
      >
        {/* Header */}
        <div class="sticky top-0 bg-gradient-to-br from-purple-600 to-indigo-700 dark:from-purple-800 dark:to-indigo-900 p-6 flex justify-between items-center z-10 shadow-xl">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/30 float-animation">
              <span class="text-2xl font-bold text-white">ib</span>
            </div>
            <h2 class="text-2xl font-bold text-white">Menu</h2>
          </div>
          <button
            onClick={toggleDrawer}
            class="p-2 rounded-xl hover:bg-white/20 transition-all duration-300 text-white border border-white/20 hover:border-white/40 active:scale-90"
            aria-label="Close menu"
          >
            <Icons.X />
          </button>
        </div>
        
        {/* Menu Items */}
        <nav class="p-4 space-y-3">
          {menuItems.map((item, index) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={toggleDrawer}
              class={`w-full flex items-center space-x-4 p-4 rounded-2xl transition-all duration-300 group text-left border border-transparent hover:border-gray-200 dark:hover:border-gray-700 ${item.hoverBg} card-reveal shadow-sm hover:shadow-lg`}
              style={`animation-delay: ${index * 0.1}s`}
            >
              <div class={`p-3 rounded-xl bg-gradient-to-br ${item.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <item.icon class="text-white w-5 h-5" />
              </div>
              <span class="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-300">
                {item.label}
              </span>
              <Icons.ChevronRight class="ml-auto text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transform group-hover:translate-x-1 transition-all duration-300" />
            </Link>
          ))}
        </nav>
        
        {/* Footer */}
        <div class="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-gray-100 dark:from-gray-900 to-transparent">
          <div class="glass-card rounded-2xl p-4 text-center border border-purple-200 dark:border-purple-800">
            <p class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
             
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              ibtwil v1.0.0
            </p>
          </div>
        </div>
      </div>
    </>
  );
};