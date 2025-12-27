// src/utils/helpers.js

// Get the Base URL from Vite's environment variables. This is the correct place for this logic.
const BASE_URL = import.meta.env.VITE_BASE_URL;

/**
 * A robust, global utility to resolve any image or media URL.
 * - If the URL is absolute (e.g., "http://..."), it's returned directly.
 * - If the URL is a data URI (e.g., "data:image/..."), it's returned directly.
 * - If the URL is relative (e.g., "/media/uploads/image.png"), it's prepended with the VITE_BASE_URL.
 * @param {string | undefined | null} url The URL to resolve.
 * @returns {string} The fully resolved, absolute URL, or an empty string if the input is invalid.
 */
export const resolveImageUrl = (url) => {
  if (!url) {
    return ''; // Return an empty string if the URL is null, undefined, or an empty string.
  }

  // Check for absolute URLs, protocol-relative URLs (//...), or data URIs. If found, return them as is.
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//') || url.startsWith('data:')) {
    return url;
  }

  // For all other cases (assumed to be relative URLs), prepend the base URL.
  return `${BASE_URL}${url}`;
};

/**
 * Pre-processes a Markdown string to resolve ALL relative media URLs
 * (images, videos, audio, iframes, links, etc.) using the global resolveImageUrl utility.
 * Handles BOTH Markdown syntax AND HTML tags!
 * @param {string} markdownContent The raw Markdown content from your API.
 * @returns {string} The processed Markdown with absolute media URLs.
 */
export const resolveMarkdownImageUrls = (markdownContent) => {
  if (!markdownContent) {
    return '';
  }

  let processedContent = markdownContent;

  // 1. Handle Markdown image syntax: ![alt text](url)
  const markdownImageRegex = /!\[(.*?)\]\((.*?)\)/g;
  processedContent = processedContent.replace(markdownImageRegex, (match, altText, url) => {
    const resolvedUrl = resolveImageUrl(url);
    return `![${altText}](${resolvedUrl})`;
  });

  // 2. Handle Markdown link syntax: [text](url)
  const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  processedContent = processedContent.replace(markdownLinkRegex, (match, text, url) => {
    // Skip if it's an image (already handled above)
    if (match.startsWith('!')) return match;
    const resolvedUrl = resolveImageUrl(url);
    return `[${text}](${resolvedUrl})`;
  });

  // 3. Handle HTML img tags: <img src="url" ... />
  const htmlImageRegex = /<img([^>]*?)src=["']([^"']+)["']([^>]*?)>/gi;
  processedContent = processedContent.replace(htmlImageRegex, (match, before, url, after) => {
    const resolvedUrl = resolveImageUrl(url);
    return `<img${before}src="${resolvedUrl}"${after}>`;
  });

  // 4. Handle HTML video tags: <video src="url" ... /> and <source src="url" />
  const htmlVideoRegex = /<video([^>]*?)src=["']([^"']+)["']([^>]*?)>/gi;
  processedContent = processedContent.replace(htmlVideoRegex, (match, before, url, after) => {
    const resolvedUrl = resolveImageUrl(url);
    return `<video${before}src="${resolvedUrl}"${after}>`;
  });

  const htmlSourceRegex = /<source([^>]*?)src=["']([^"']+)["']([^>]*?)>/gi;
  processedContent = processedContent.replace(htmlSourceRegex, (match, before, url, after) => {
    const resolvedUrl = resolveImageUrl(url);
    return `<source${before}src="${resolvedUrl}"${after}>`;
  });

  // 5. Handle HTML audio tags: <audio src="url" ... />
  const htmlAudioRegex = /<audio([^>]*?)src=["']([^"']+)["']([^>]*?)>/gi;
  processedContent = processedContent.replace(htmlAudioRegex, (match, before, url, after) => {
    const resolvedUrl = resolveImageUrl(url);
    return `<audio${before}src="${resolvedUrl}"${after}>`;
  });

  // 6. Handle HTML anchor tags: <a href="url" ... />
  const htmlAnchorRegex = /<a([^>]*?)href=["']([^"']+)["']([^>]*?)>/gi;
  processedContent = processedContent.replace(htmlAnchorRegex, (match, before, url, after) => {
    const resolvedUrl = resolveImageUrl(url);
    return `<a${before}href="${resolvedUrl}"${after}>`;
  });

  // 7. Handle HTML iframe tags: <iframe src="url" ... />
  const htmlIframeRegex = /<iframe([^>]*?)src=["']([^"']+)["']([^>]*?)>/gi;
  processedContent = processedContent.replace(htmlIframeRegex, (match, before, url, after) => {
    const resolvedUrl = resolveImageUrl(url);
    return `<iframe${before}src="${resolvedUrl}"${after}>`;
  });

  // 8. Handle HTML embed tags: <embed src="url" ... />
  const htmlEmbedRegex = /<embed([^>]*?)src=["']([^"']+)["']([^>]*?)>/gi;
  processedContent = processedContent.replace(htmlEmbedRegex, (match, before, url, after) => {
    const resolvedUrl = resolveImageUrl(url);
    return `<embed${before}src="${resolvedUrl}"${after}>`;
  });

  // 9. Handle HTML object tags: <object data="url" ... />
  const htmlObjectRegex = /<object([^>]*?)data=["']([^"']+)["']([^>]*?)>/gi;
  processedContent = processedContent.replace(htmlObjectRegex, (match, before, url, after) => {
    const resolvedUrl = resolveImageUrl(url);
    return `<object${before}data="${resolvedUrl}"${after}>`;
  });

  return processedContent;
};

/**
 * Formats a date string into a more readable format (e.g., "Oct 14, 2025").
 * @param {string} dateString The ISO date string to format.
 * @returns {string} The formatted date.
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

/**
 * Formats a date string into a relative time from now (e.g., "5m ago", "2h ago").
 * @param {string} dateString The ISO date string.
 * @returns {string} The formatted relative time.
 */
export const formatRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return formatDate(dateString);
};

/**
 * A utility to delay the execution of a function. Useful for search inputs.
 * @param {Function} func The function to debounce.
 * @param {number} wait The delay in milliseconds.
 * @returns {Function} The debounced function.
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Returns a consistent color class for tags based on their index.
 * @param {number} index The index of the tag in a list.
 * @returns {string} A Tailwind CSS class name for the tag color.
 */
export const getTagColor = (index) => {
  const colors = [
    'tag-neon-cyan',
    'tag-neon-green',
    'tag-neon-orange',
    'tag-neon-pink',
  ];
  return colors[index % colors.length];
};