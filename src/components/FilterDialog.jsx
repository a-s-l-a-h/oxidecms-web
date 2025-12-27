import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { useStore } from '../store/store';
import { Icons } from './Icons';

export const FilterDialog = ({ isOpen, onClose }) => {
  const {
    availableTags,
    selectedTags,
    applyFilters,
    rememberFilter,
    setRememberFilter
  } = useStore();

  const [tempSelectedTags, setTempSelectedTags] = useState(new Set(selectedTags));

  useEffect(() => {
    if (isOpen) {
      setTempSelectedTags(new Set(selectedTags));
    }
  }, [isOpen, selectedTags]);

  if (!isOpen) return null;

  const handleToggleTag = (tag) => {
    setTempSelectedTags(prev => {
      const newTags = new Set(prev);
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
      }
      if (newTags.size === 0) {
        newTags.add('All');
      }
      return newTags;
    });
  };
  
  const handleClearTempSelection = () => {
    setTempSelectedTags(new Set(['All']));
  };

  const handleApplyFilters = () => {
    applyFilters(tempSelectedTags);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        class="fixed inset-0 bg-black/70 backdrop-blur-md z-50 animate-fadeIn"
        onClick={onClose}
      />

      {/* Dialog */}
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div class="glass-card rounded-3xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto pointer-events-auto animate-slideUp custom-scrollbar border-2 border-purple-200 dark:border-purple-800">
          {/* Header */}
          <div class="sticky top-0 bg-gradient-to-br from-purple-600 to-indigo-700 dark:from-purple-800 dark:to-indigo-900 backdrop-blur-lg p-8 flex items-center justify-between z-10 shadow-xl rounded-t-3xl">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg border-2 border-white/30">
                <Icons.Filter class="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 class="text-3xl font-bold text-white">Filter by Tags</h2>
                <p class="text-purple-200 text-sm mt-1">Select topics you're interested in</p>
              </div>
            </div>
            <button
              onClick={onClose}
              class="p-3 rounded-xl hover:bg-white/20 transition-all duration-300 text-white border-2 border-white/30 hover:border-white/50 active:scale-90"
              aria-label="Close dialog"
            >
              <Icons.X />
            </button>
          </div>

          {/* Content */}
          <div class="p-8">
            {availableTags.length === 0 ? (
              <div class="text-center py-12">
                <div class="w-20 h-20 mx-auto mb-4 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                  <div class="spinner w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full"></div>
                </div>
                <p class="text-gray-600 dark:text-gray-400 text-lg">Loading tags...</p>
              </div>
            ) : (
              <>
                <div class="mb-6">
                  <div class="flex items-center justify-between mb-4">
                    <p class="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {tempSelectedTags.size} {tempSelectedTags.size === 1 ? 'tag' : 'tags'} selected
                    </p>
                    <button
                      onClick={handleClearTempSelection}
                      class="text-sm font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors flex items-center gap-2"
                    >
                      <Icons.X class="w-4 h-4" />
                      Clear All
                    </button>
                  </div>
                </div>

                <div class="flex flex-wrap gap-3 mb-8">
                  {['All', ...availableTags].map((tag, index) => {
                    const isSelected = tempSelectedTags.has(tag);
                    return (
                      <button
                        key={tag}
                        onClick={() => handleToggleTag(tag)}
                        class={`px-5 py-3 rounded-xl font-bold transition-all duration-300 border-2 transform hover:scale-105 active:scale-95 card-reveal ${
                          isSelected
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50 border-transparent'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 border-gray-300 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-600'
                        }`}
                        style={`animation-delay: ${index * 0.03}s`}
                      >
                        {isSelected && (
                          <span class="inline-block mr-2">✓</span>
                        )}
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
            
            {/* --- THIS SECTION IS NOW RESTORED --- */}
            <div class="border-t-2 border-gray-200 dark:border-gray-700 pt-8">
              <div class="glass-card rounded-2xl p-6 border-2 border-purple-200 dark:border-purple-800">
                <label class="flex items-center justify-between cursor-pointer group">
                  <div class="flex items-center gap-4">
                    <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <div>
                      <span class="text-base font-bold text-gray-900 dark:text-white block">
                        Remember my preferences
                      </span>
                      <span class="text-sm text-gray-600 dark:text-gray-400">
                        Save your filter settings for next time
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={rememberFilter}
                    onChange={(e) => setRememberFilter(e.target.checked)}
                    class="w-6 h-6 rounded-lg border-2 border-gray-300 text-purple-600 focus:ring-purple-500 focus:ring-offset-2 cursor-pointer transition-all"
                  />
                </label>
              </div>
            </div>
            
            {/* Footer */}
            <div class="mt-8 flex justify-end gap-3">
              <button
                onClick={onClose}
                class="px-8 py-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95 border-2 border-gray-300 dark:border-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyFilters}
                class="btn-primary px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-2xl active:scale-95 border-2 border-transparent flex items-center gap-2"
              >
                <Icons.Check class="w-5 h-5" />
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};