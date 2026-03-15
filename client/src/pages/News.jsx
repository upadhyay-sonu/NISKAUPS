import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Newspaper,
  TrendingUp,
  BookOpen,
  Search,
} from "lucide-react";
import api from "../config/api";

const News = () => {
  const [headlines, setHeadlines] = useState([]);
  const [bookNews, setBookNews] = useState([]);
  const [trendingNews, setTrendingNews] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("top");
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const trendingSliderRef = useRef(null);
  const refreshIntervalRef = useRef(null);

  // Filter articles to remove invalid/parked URLs and incomplete data
  const cleanArticles = (articles) => {
    if (!Array.isArray(articles)) return [];

    return articles.filter((article) => {
      // Must have URL
      if (!article.url || typeof article.url !== "string") return false;

      // Must have title
      if (!article.title || typeof article.title !== "string") return false;

      // Must have description
      if (!article.description || typeof article.description !== "string")
        return false;

      // Filter out GoDaddy parked domains
      const urlLower = article.url.toLowerCase();
      if (urlLower.includes("godaddy") || urlLower.includes("forsale")) {
        console.warn("Filtered out parked domain:", article.url);
        return false;
      }

      // Filter out invalid URLs (must start with http)
      if (!article.url.startsWith("http")) return false;

      // Optional: require image for better presentation
      // if (!article.image && !article.urlToImage) return false;

      return true;
    });
  };

  useEffect(() => {
    fetchAllNews();

    // Auto-refresh news every 10 minutes (600000 ms)
    refreshIntervalRef.current = setInterval(
      () => {
        console.log("Auto-refreshing news...");
        fetchAllNews(true);
      },
      10 * 60 * 1000,
    );

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, []);

  const fetchAllNews = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      // Fetch headlines
      const headlinesRes = await api.get("/news/headlines");
      const headlinesData = headlinesRes.data;
      const headlinesArticles = Array.isArray(headlinesData)
        ? headlinesData
        : headlinesData?.articles || [];

      // Fetch book news
      const booksRes = await api.get("/news/books");
      const booksData = booksRes.data;
      const bookArticles = Array.isArray(booksData)
        ? booksData
        : booksData?.articles || [];

      // Fetch trending news
      const trendingRes = await api.get("/news/trending");
      const trendingData = trendingRes.data;
      const trendingArticles = Array.isArray(trendingData)
        ? trendingData
        : trendingData?.articles || [];

      console.log("News fetched successfully:", {
        headlines: headlinesArticles.length,
        bookNews: bookArticles.length,
        trending: trendingArticles.length,
      });

      console.log("Headlines raw response:", headlinesData);
      console.log("Headlines articles:", headlinesArticles);
      if (headlinesArticles.length > 0) {
        console.log(
          "First headline:",
          JSON.stringify(headlinesArticles[0], null, 2),
        );
      }

      // Update state with cleaned articles
      const cleanedHeadlines = cleanArticles(headlinesArticles).slice(0, 12);
      const cleanedBooks = cleanArticles(bookArticles).slice(0, 12);
      const cleanedTrending = cleanArticles(trendingArticles).slice(0, 12);

      setHeadlines(cleanedHeadlines);
      setBookNews(cleanedBooks);
      setTrendingNews(cleanedTrending);

      console.log("Cleaned articles:", {
        headlines: cleanedHeadlines.length,
        books: cleanedBooks.length,
        trending: cleanedTrending.length,
      });

      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to fetch news:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    try {
      const response = await api.get("/news/search", {
        params: { query: searchQuery },
      });
      setSearchResults(response.data?.articles || []);
      setActiveTab("search");
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
    }
    setSearchLoading(false);
  };

  const scrollTrendingRight = () => {
    if (trendingSliderRef.current) {
      trendingSliderRef.current.scrollBy({ left: 400, behavior: "smooth" });
    }
  };

  const scrollTrendingLeft = () => {
    if (trendingSliderRef.current) {
      trendingSliderRef.current.scrollBy({ left: -400, behavior: "smooth" });
    }
  };

  const NewsCard = ({ article }) => {
    // Double-check URL safety before rendering
    if (!article.url || !article.url.startsWith("http")) {
      return null;
    }

    const urlLower = article.url.toLowerCase();
    if (urlLower.includes("godaddy") || urlLower.includes("forsale")) {
      return null;
    }

    return (
      <motion.a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ y: -8 }}
        className="card-glass overflow-hidden cursor-pointer block group"
      >
        <div className="w-full h-48 bg-neutral-100 overflow-hidden relative">
          {article.image ? (
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              onError={(e) => {
                e.target.src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23e5e7eb' width='400' height='300'/%3E%3Ctext x='50%' y='50%' font-size='16' fill='%239ca3af' text-anchor='middle' dy='.3em'%3ENews Image%3C/text%3E%3C/svg%3E";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-200 to-neutral-300">
              <Newspaper size={48} className="text-neutral-400" />
            </div>
          )}
          <span className="absolute top-3 right-3 bg-primary text-white text-xs px-3 py-1 rounded-full">
            {article.provider}
          </span>
        </div>
        <div className="p-4">
          <p className="text-xs text-neutral-500 mb-2">
            {article.source} •{" "}
            {new Date(article.publishedAt).toLocaleDateString()}
          </p>
          <h3 className="font-serif font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition">
            {article.title}
          </h3>
          <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
            {article.description}
          </p>
          <div className="flex items-center gap-2 text-primary font-semibold text-sm">
            Read More
            <ArrowRight
              size={14}
              className="group-hover:translate-x-1 transition"
            />
          </div>
        </div>
      </motion.a>
    );
  };

  const NewsGrid = ({ articles }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article, idx) => (
        <NewsCard key={`${article.url}-${idx}`} article={article} />
      ))}
    </div>
  );

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full"
    >
      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="bg-gradient-to-br from-neutral-900 to-neutral-800 text-white py-16 md:py-24"
      >
        <div className="container-custom">
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-6xl font-serif font-bold mb-4 text-white"
          >
            Latest News
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-lg text-neutral-300 mb-8 max-w-2xl"
          >
            Real-time news from multiple trusted sources about books, authors,
            literature, and the publishing world
          </motion.p>

          {/* Search Box */}
          <motion.form onSubmit={handleSearch} variants={itemVariants}>
            <div className="flex gap-2 max-w-xl">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search news..."
                  className="w-full px-4 py-3 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <button
                type="submit"
                disabled={searchLoading}
                className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition disabled:opacity-50"
              >
                <Search size={20} />
              </button>
            </div>
          </motion.form>
        </div>
      </motion.section>

      {/* Tab Navigation */}
      <div className="sticky top-20 z-30 bg-white border-b border-neutral-200">
        <div className="container-custom flex gap-2 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveTab("top")}
            className={`px-4 py-4 font-semibold whitespace-nowrap transition ${
              activeTab === "top"
                ? "text-primary border-b-2 border-primary"
                : "text-neutral-600 hover:text-primary"
            }`}
          >
            <Newspaper size={18} className="inline mr-2" />
            Top Headlines
          </button>
          <button
            onClick={() => setActiveTab("books")}
            className={`px-4 py-4 font-semibold whitespace-nowrap transition ${
              activeTab === "books"
                ? "text-primary border-b-2 border-primary"
                : "text-neutral-600 hover:text-primary"
            }`}
          >
            <BookOpen size={18} className="inline mr-2" />
            Book News
          </button>
          <button
            onClick={() => setActiveTab("trending")}
            className={`px-4 py-4 font-semibold whitespace-nowrap transition ${
              activeTab === "trending"
                ? "text-primary border-b-2 border-primary"
                : "text-neutral-600 hover:text-primary"
            }`}
          >
            <TrendingUp size={18} className="inline mr-2" />
            Trending
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom py-12">
        {loading &&
        !headlines.length &&
        !bookNews.length &&
        !trendingNews.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="bg-neutral-200 h-64 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : activeTab === "top" ? (
          <>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-3xl font-serif font-bold mb-2"
            >
              Top Headlines
            </motion.h2>
            {lastUpdated && (
              <p className="text-sm text-neutral-500 mb-6">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
            {headlines && headlines.length > 0 ? (
              <NewsGrid articles={headlines} />
            ) : (
              <div className="text-center py-12">
                <Newspaper
                  size={48}
                  className="text-neutral-300 mx-auto mb-4"
                />
                <p className="text-neutral-500">
                  {loading
                    ? "Loading headlines from news sources..."
                    : "No headlines available"}
                </p>
              </div>
            )}
          </>
        ) : activeTab === "books" ? (
          <>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-3xl font-serif font-bold mb-2"
            >
              Book & Literature News
            </motion.h2>
            {lastUpdated && (
              <p className="text-sm text-neutral-500 mb-6">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
            {bookNews && bookNews.length > 0 ? (
              <NewsGrid articles={bookNews} />
            ) : (
              <div className="text-center py-12">
                <BookOpen size={48} className="text-neutral-300 mx-auto mb-4" />
                <p className="text-neutral-500">
                  {loading
                    ? "Loading book news from sources..."
                    : "No book news available"}
                </p>
              </div>
            )}
          </>
        ) : activeTab === "trending" ? (
          <>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-3xl font-serif font-bold mb-2"
            >
              Trending News
            </motion.h2>
            {lastUpdated && (
              <p className="text-sm text-neutral-500 mb-6">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
            {trendingNews && trendingNews.length > 0 ? (
              <NewsGrid articles={trendingNews} />
            ) : (
              <div className="text-center py-12">
                <TrendingUp
                  size={48}
                  className="text-neutral-300 mx-auto mb-4"
                />
                <p className="text-neutral-500">
                  {loading
                    ? "Loading trending topics..."
                    : "No trending news available"}
                </p>
              </div>
            )}
          </>
        ) : searchQuery ? (
          <>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-3xl font-serif font-bold mb-2"
            >
              Search Results
            </motion.h2>
            <p className="text-neutral-600 mb-8">
              {searchResults.length} results for "{searchQuery}"
            </p>
            {searchResults.length > 0 ? (
              <NewsGrid articles={searchResults} />
            ) : (
              <p className="text-neutral-600">
                No results found for "{searchQuery}"
              </p>
            )}
          </>
        ) : null}
      </div>
    </motion.div>
  );
};

export default News;
