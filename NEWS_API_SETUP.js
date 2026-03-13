// NEWS API SETUP GUIDE
// =====================
//
// Add the following environment variables to your .env file:
//
// NEWSAPI_KEY=your_newsapi_key_here
// GNEWS_KEY=your_gnews_key_here
// GUARDIAN_KEY=your_guardian_key_here
// NYTIMES_KEY=your_nytimes_key_here
//
// =====================
// GETTING API KEYS
// =====================
//
// 1. NewsAPI (https://newsapi.org/)
//    - Go to https://newsapi.org/
//    - Sign up for a free account
//    - Get your API key from dashboard
//    - Free tier: 100 requests per day
//
// 2. GNews (https://gnews.io/)
//    - Go to https://gnews.io/
//    - Sign up for free account
//    - Get your API key from dashboard
//    - Free tier: 100 requests per day
//
// 3. The Guardian (https://open-platform.theguardian.com/)
//    - Go to https://open-platform.theguardian.com/
//    - Sign up for free account
//    - Get your API key from dashboard
//    - Free tier: 12 requests per second
//
// 4. New York Times (https://developer.nytimes.com/)
//    - Go to https://developer.nytimes.com/
//    - Sign up for account
//    - Get your API key from Account menu
//    - Free tier: 4000 requests per day
//
// =====================
// API ENDPOINTS
// =====================
//
// GET /api/news/top
//   - Returns top headlines about books and news
//   - Cached for 5 minutes
//
// GET /api/news/books
//   - Returns news specifically about books and literature
//   - Cached for 5 minutes
//
// GET /api/news/trending
//   - Returns trending literary news and publishing updates
//   - Cached for 5 minutes
//
// GET /api/news/search?query=YOUR_QUERY
//   - Search for news with custom query
//   - Example: /api/news/search?query=Stephen%20King
//   - Returns up to 15 articles
//
// =====================
// FEATURES
// =====================
//
// ✓ Multiple API sources (4 different providers)
// ✓ Automatic deduplication across sources
// ✓ 5-minute caching to reduce API calls
// ✓ Fallback handling if one API fails
// ✓ Image validation with placeholder fallbacks
// ✓ Real-time article fetching
// ✓ Search functionality
// ✓ Three content categories:
//   - Top Headlines (general + books)
//   - Book News (literature-specific)
//   - Trending (publishing industry news)
//
// =====================
// RESPONSE FORMAT
// =====================
//
// {
//   "success": true,
//   "articles": [
//     {
//       "title": "Article Title",
//       "description": "Short description",
//       "image": "https://example.com/image.jpg",
//       "source": "Source Name",
//       "url": "https://example.com/article",
//       "publishedAt": "2024-01-15T10:30:00Z",
//       "provider": "NewsAPI|GNews|Guardian|NYTimes"
//     }
//   ],
//   "cached": false
// }
//
// =====================
// FRONTEND PAGES
// =====================
//
// News Page (/news):
//   - Four tabs: Top Headlines, Book News, Trending
//   - Search functionality
//   - Responsive grid layout (3 columns on desktop)
//   - News cards with images and metadata
//   - Direct links to source articles
//   - Fallback images if news images fail
//   - Provider badges on cards
//
// =====================
// CACHING
// =====================
//
// Cache Duration: 5 minutes
// Storage: In-memory (Node.js memory)
// Benefits:
//   - Reduces API quota usage
//   - Faster page loads
//   - Less network requests
//
// Cache automatically expires after 5 minutes and refreshes on next request
//
// =====================
// ERROR HANDLING
// =====================
//
// - If an API fails, other APIs continue to fetch
// - Graceful degradation - still returns results from working APIs
// - Fallback placeholder image if article image is unavailable
// - Returns cached results if API fails on refresh
//
// =====================
// RATE LIMITS
// =====================
//
// NewsAPI:      100 requests/day (free)
// GNews:        100 requests/day (free)
// Guardian:     12 requests/second
// NYTimes:      4000 requests/day (free)
//
// With 5-minute caching:
// - 3 main endpoints (top/books/trending)
// - Each cached for 5 minutes
// - Max ~290 requests/day per API (much below limits)
//
// =====================
// TESTING
// =====================
//
// Test endpoints using:
//   curl http://localhost:5000/api/news/top
//   curl http://localhost:5000/api/news/books
//   curl http://localhost:5000/api/news/trending
//   curl "http://localhost:5000/api/news/search?query=books"
//
// Or visit in browser (after setting up keys):
//   http://localhost:5173/news
//
// =====================
// TROUBLESHOOTING
// =====================
//
// No articles returned:
//   1. Check API keys are set in .env
//   2. Verify API keys are valid
//   3. Check API rate limits haven't been exceeded
//   4. Check network connectivity
//
// Images not loading:
//   - Placeholder image is shown automatically
//   - User can click "Read More" to go to source
//
// Slow page load:
//   - First load (cold cache) takes ~5-10 seconds
//   - Subsequent loads cached and instant
//   - Adjust CACHE_DURATION if needed
//
// =====================
