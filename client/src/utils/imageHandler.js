/**
 * Image handling utility for managing external image URLs and fallbacks
 */

export const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23f0f0f0" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-family="system-ui" font-size="18"%3EImage not available%3C/text%3E%3C/svg%3E';

/**
 * Handle image loading errors with fallback
 * @param {Event} event - The error event from img tag
 * @param {string} fallbackSrc - Optional custom fallback image
 */
export const handleImageError = (event, fallbackSrc = PLACEHOLDER_IMAGE) => {
  if (event?.target && event.target.src !== fallbackSrc) {
    event.target.src = fallbackSrc;
  }
};

/**
 * Get optimized image URL with error handling
 * @param {string} imageUrl - Original image URL
 * @param {string} fallbackUrl - Fallback image URL
 * @returns {object} - Object with src and onError handler
 */
export const getImageProps = (imageUrl, fallbackUrl = PLACEHOLDER_IMAGE) => {
  return {
    src: imageUrl || PLACEHOLDER_IMAGE,
    onError: (e) => handleImageError(e, fallbackUrl),
    loading: 'lazy',
    alt: 'Product image',
  };
};

/**
 * Convert external CDN URLs to be more reliable
 * @param {string} url - Original URL
 * @returns {string} - Potentially modified URL
 */
export const optimizeImageUrl = (url) => {
  if (!url) return PLACEHOLDER_IMAGE;

  // If URL is already HTTPS and from common sources, use as-is
  if (url.startsWith('https://')) {
    return url;
  }

  // Convert HTTP to HTTPS if needed
  if (url.startsWith('http://')) {
    return url.replace('http://', 'https://');
  }

  return url;
};

export default {
  handleImageError,
  getImageProps,
  optimizeImageUrl,
  PLACEHOLDER_IMAGE,
};
