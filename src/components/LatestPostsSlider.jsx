import { h } from 'preact';
import { useRef } from 'preact/hooks';
import { Link } from 'preact-router';
import { useStore } from '../store/store';
import { resolveImageUrl } from '../utils/helpers';
import { Icons } from './Icons';

export const LatestPostsSlider = () => {
  const { latestPosts } = useStore();
  const sliderRef = useRef(null);

  if (!latestPosts || latestPosts.length === 0) {
    return (
      <div class="h-96 mb-12">
        <div class="skeleton h-full w-full rounded-3xl"></div>
      </div>
    );
  }

  return (
    <div class="relative w-full mb-12">

      
      {/* Slider */}
      <div class="relative overflow-hidden rounded-3xl shadow-2xl">
        <div 
          ref={sliderRef}
          class="flex h-96 w-full overflow-x-auto snap-x snap-mandatory hide-scrollbar scroll-smooth gap-4 px-4 py-2"
        >
          {latestPosts.map((post, index) => (
            <div 
              key={post.id}
              class="snap-center flex-shrink-0 w-5/6 md:w-2/5 h-full animate-slideUp"
              style={`animation-delay: ${index * 0.1}s`}
            >
              <Link
                href={`/posts/${post.id}`}
                class="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl group border-4 border-white dark:border-gray-800 hover:border-purple-400 dark:hover:border-purple-600 transition-all duration-500 block"
              >
                {post.coverImage && (
                  <img 
                    src={resolveImageUrl(post.coverImage)} 
                    alt={post.title}
                    width="400"
                    height="400"
                    loading="lazy"
                    class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                )}
                
                <div class="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-500"></div>
                
                <div class="absolute inset-0 p-8 flex flex-col justify-end text-left">
                  <h3 class="font-bold text-2xl text-white mb-3 line-clamp-2 drop-shadow-2xl">{post.title}</h3>
                  <p class="text-base text-white/95 line-clamp-2 mb-5 drop-shadow-lg">{post.summary}</p>
                  <div class="flex items-center justify-end mt-auto">
                    <div class="px-5 py-3 bg-white/20 backdrop-blur-md rounded-xl text-white font-bold text-sm group-hover:bg-white/30 transition-colors">
                      Read More
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};