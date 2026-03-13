const axios = require("axios");
const path = require("path");
const fs = require("fs");

// Load fallback news data
let fallbackNewsData = { topNews: [], bookNews: [], trendingNews: [] };
try {
  const fallbackPath = path.join(__dirname, "../data/fallbackNews.json");
  const fallbackContent = fs.readFileSync(fallbackPath, "utf8");
  fallbackNewsData = JSON.parse(fallbackContent);
  console.log("✅ Fallback news data loaded successfully");
} catch (error) {
  console.warn("⚠️  Could not load fallback news data:", error.message);
}

// Cache storage
const newsCache = {
  top: { data: null, timestamp: null },
  books: { data: null, timestamp: null },
  trending: { data: null, timestamp: null },
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const isCacheValid = (cacheEntry) => {
  if (!cacheEntry.data || !cacheEntry.timestamp) return false;
  return Date.now() - cacheEntry.timestamp < CACHE_DURATION;
};

const newsKeywords = [
  "books",
  "authors",
  "literature",
  "publishing",
  "reading",
  "bestsellers",
];

// Fetch from NewsAPI
const fetchFromNewsAPI = async (query) => {
  try {
    const apiKey = process.env.NEWSAPI_KEY;
    if (!apiKey) {
      console.warn("NewsAPI key not configured");
      return [];
    }

    const response = await axios.get("https://newsapi.org/v2/everything", {
      params: {
        q: query,
        sortBy: "publishedAt",
        language: "en",
        pageSize: 10,
        apiKey: apiKey,
      },
      timeout: 8000,
    });

    const articles = (response.data.articles || [])
      .filter((article) => article.title && article.description)
      .slice(0, 5)
      .map((article) => ({
        title: article.title,
        description: article.description || "No description available",
        image: article.urlToImage,
        source: article.source?.name || "NewsAPI",
        url: article.url,
        publishedAt: article.publishedAt,
        provider: "NewsAPI",
      }));

    console.log(`NewsAPI: Fetched ${articles.length} articles for query: "${query}"`);
    return articles;
  } catch (error) {
    console.error("NewsAPI Error:", error.message);
    return [];
  }
};

// Fetch from GNews API
const fetchFromGNews = async (query) => {
  try {
    const apiKey = process.env.GNEWS_KEY;
    if (!apiKey) {
      console.warn("GNews key not configured");
      return [];
    }

    const response = await axios.get("https://gnews.io/api/v4/search", {
      params: {
        q: query,
        lang: "en",
        sortby: "publishedAt",
        max: 10,
        apikey: apiKey,
      },
      timeout: 8000,
    });

    const articles = (response.data.articles || [])
      .filter((article) => article.title && article.description)
      .slice(0, 5)
      .map((article) => ({
        title: article.title,
        description: article.description || "No description available",
        image: article.image,
        source: article.source?.name || "GNews",
        url: article.url,
        publishedAt: article.publishedAt,
        provider: "GNews",
      }));

    console.log(`GNews: Fetched ${articles.length} articles for query: "${query}"`);
    return articles;
  } catch (error) {
    console.error("GNews API Error:", error.message);
    return [];
  }
};

// Fetch from The Guardian API
const fetchFromGuardian = async (query) => {
  try {
    const apiKey = process.env.GUARDIAN_KEY;
    if (!apiKey) {
      console.warn("Guardian API key not configured");
      return [];
    }

    const response = await axios.get(
      "https://open-platform.theguardian.com/search",
      {
        params: {
          q: query,
          "api-key": apiKey,
          "show-fields": "thumbnail,trailText",
          "page-size": 10,
        },
        timeout: 8000,
      }
    );

    const articles = (response.data.response.results || [])
      .filter((article) => article.webTitle && article.fields?.trailText)
      .slice(0, 5)
      .map((article) => ({
        title: article.webTitle,
        description: article.fields?.trailText || "No description available",
        image: article.fields?.thumbnail,
        source: "The Guardian",
        url: article.webUrl,
        publishedAt: article.webPublicationDate,
        provider: "Guardian",
      }));

    console.log(`Guardian: Fetched ${articles.length} articles for query: "${query}"`);
    return articles;
  } catch (error) {
    console.error("Guardian API Error:", error.message);
    return [];
  }
};

// Fetch from New York Times API
const fetchFromNYTimes = async (query) => {
  try {
    const apiKey = process.env.NYTIMES_KEY;
    if (!apiKey) {
      console.warn("New York Times API key not configured");
      return [];
    }

    const response = await axios.get(
      "https://api.nytimes.com/svc/search/v2/articlesearch.json",
      {
        params: {
          q: query,
          "api-key": apiKey,
          sort: "newest",
        },
        timeout: 8000,
      }
    );

    const articles = (response.data.response.docs || [])
      .filter(
        (article) =>
          article.headline?.main && (article.abstract || article.lead_paragraph)
      )
      .slice(0, 5)
      .map((article) => ({
        title: article.headline?.main || "No Title",
        description: article.abstract || article.lead_paragraph || "No description available",
        image:
          article.multimedia?.[0]?.url &&
          `https://www.nytimes.com/${article.multimedia[0].url}`,
        source: "New York Times",
        url: article.web_url,
        publishedAt: article.pub_date,
        provider: "NYTimes",
      }));

    console.log(`NYTimes: Fetched ${articles.length} articles for query: "${query}"`);
    return articles;
  } catch (error) {
    console.error("New York Times API Error:", error.message);
    return [];
  }
};

// Combine and deduplicate news from multiple sources
const combineNews = (newsArrays) => {
  const combined = newsArrays.flat();
  const seen = new Set();
  return combined
    .filter((news) => {
      const key = news.title?.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .filter((news) => news.title && news.description) // Only require title and description
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
};

exports.getTopNews = async (req, res) => {
  try {
    // Check cache
    if (isCacheValid(newsCache.top)) {
      return res.status(200).json({
        success: true,
        articles: newsCache.top.data,
        cached: true,
      });
    }

    const topicNews = "news headlines books";

    const results = await Promise.allSettled([
      fetchFromNewsAPI(topicNews),
      fetchFromGNews(topicNews),
      fetchFromGuardian(topicNews),
      fetchFromNYTimes(topicNews),
    ]);

    // Extract successful results
    const newsResults = results
      .map((result) => (result.status === "fulfilled" ? result.value : []))
      .filter((news) => news && news.length > 0);

    if (newsResults.length === 0) {
      console.warn("No news sources available for top news");
      return res.status(200).json({
        success: true,
        articles: newsCache.top.data || [],
        cached: false,
        fallback: true,
      });
    }

    let articles = combineNews(newsResults).slice(0, 10);

    // Use fallback data if no articles found
    if (articles.length === 0 && fallbackNewsData.topNews.length > 0) {
      console.log("Using fallback data for top news");
      articles = fallbackNewsData.topNews;
    }

    // Cache results
    newsCache.top = {
      data: articles,
      timestamp: Date.now(),
    };

    res.status(200).json({
      success: true,
      articles: articles.length > 0 ? articles : newsCache.top.data || [],
      cached: false,
    });
  } catch (error) {
    console.error("Error fetching top news:", error.message);
    const fallbackArticles = newsCache.top.data || fallbackNewsData.topNews || [];
    res.status(200).json({
      success: true,
      articles: fallbackArticles,
      cached: false,
      fallback: true,
    });
  }
};

exports.getBookNews = async (req, res) => {
  try {
    // Check cache
    if (isCacheValid(newsCache.books)) {
      return res.status(200).json({
        success: true,
        articles: newsCache.books.data,
        cached: true,
      });
    }

    const bookQuery = "books authors literature";

    const results = await Promise.allSettled([
      fetchFromNewsAPI(bookQuery),
      fetchFromGNews(bookQuery),
      fetchFromGuardian(bookQuery),
      fetchFromNYTimes(bookQuery),
    ]);

    // Extract successful results
    const newsResults = results
      .map((result) => (result.status === "fulfilled" ? result.value : []))
      .filter((news) => news && news.length > 0);

    if (newsResults.length === 0) {
      console.warn("No news sources available for book news");
      return res.status(200).json({
        success: true,
        articles: newsCache.books.data || [],
        cached: false,
        fallback: true,
      });
    }

    let articles = combineNews(newsResults).slice(0, 12);

    // Use fallback data if no articles found
    if (articles.length === 0 && fallbackNewsData.bookNews.length > 0) {
      console.log("Using fallback data for book news");
      articles = fallbackNewsData.bookNews;
    }

    // Cache results
    newsCache.books = {
      data: articles,
      timestamp: Date.now(),
    };

    res.status(200).json({
      success: true,
      articles: articles.length > 0 ? articles : newsCache.books.data || [],
      cached: false,
    });
  } catch (error) {
    console.error("Error fetching book news:", error.message);
    const fallbackArticles = newsCache.books.data || fallbackNewsData.bookNews || [];
    res.status(200).json({
      success: true,
      articles: fallbackArticles,
      cached: false,
      fallback: true,
    });
  }
};

exports.getTrendingNews = async (req, res) => {
  try {
    // Check cache
    if (isCacheValid(newsCache.trending)) {
      return res.status(200).json({
        success: true,
        articles: newsCache.trending.data,
        cached: true,
      });
    }

    const trendingQueries = [
      "bestsellers",
      "publishing industry",
      "book awards",
      "author interviews",
    ];

    const newsResults = await Promise.all(
      trendingQueries.map(async (query) => {
        const results = await Promise.allSettled([
          fetchFromNewsAPI(query),
          fetchFromGNews(query),
          fetchFromGuardian(query),
          fetchFromNYTimes(query),
        ]);

        const successfulResults = results
          .map((result) => (result.status === "fulfilled" ? result.value : []))
          .filter((news) => news && news.length > 0);

        return successfulResults.length > 0
          ? combineNews(successfulResults).slice(0, 3)
          : [];
      })
    );

    let combinedArticles = combineNews(newsResults.filter((arr) => arr.length > 0))
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
      .slice(0, 8);

    // Use fallback data if no articles found
    if (combinedArticles.length === 0 && fallbackNewsData.trendingNews.length > 0) {
      console.log("Using fallback data for trending news");
      combinedArticles = fallbackNewsData.trendingNews;
    }

    // Cache results
    newsCache.trending = {
      data: combinedArticles,
      timestamp: Date.now(),
    };

    res.status(200).json({
      success: true,
      articles:
        combinedArticles.length > 0
          ? combinedArticles
          : newsCache.trending.data || [],
      cached: false,
    });
  } catch (error) {
    console.error("Error fetching trending news:", error.message);
    const fallbackArticles = newsCache.trending.data || fallbackNewsData.trendingNews || [];
    res.status(200).json({
      success: true,
      articles: fallbackArticles,
      cached: false,
      fallback: true,
    });
  }
};

exports.searchNews = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Search query must be at least 2 characters",
      });
    }

    const results = await Promise.allSettled([
      fetchFromNewsAPI(query),
      fetchFromGNews(query),
      fetchFromGuardian(query),
      fetchFromNYTimes(query),
    ]);

    // Extract successful results
    const newsResults = results
      .map((result) => (result.status === "fulfilled" ? result.value : []))
      .filter((news) => news && news.length > 0);

    const articles = combineNews(newsResults).slice(0, 15);

    res.status(200).json({
      success: true,
      articles,
      query,
      count: articles.length,
    });
  } catch (error) {
    console.error("Error searching news:", error.message);
    res.status(200).json({
      success: true,
      articles: [],
      query,
      count: 0,
    });
  }
};
