import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ExternalLink, AlertCircle } from "lucide-react";
import axios from "axios";

const Destination = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      const controller = new AbortController();

      try {
        setLoading(true);
        setError(null);

        console.log("Starting fetch from http://localhost:5000/api/books");

        const response = await axios.get("http://localhost:5000/api/books", {
          signal: controller.signal,
          timeout: 10000,
        });

        console.log("Response received:", response.status);
        console.log("Response data:", response.data);

        const booksArray = response.data?.books || [];
        console.log("Books array:", booksArray);
        console.log("Books array length:", booksArray.length);

        if (!Array.isArray(booksArray)) {
          throw new Error("Books data is not an array");
        }

        setBooks(booksArray);

        if (booksArray.length === 0) {
          setError(
            "No books available. Check if Google API key is set in server .env",
          );
        }
      } catch (err) {
        if (err.name !== "CanceledError") {
          console.error("Detailed error:", {
            name: err.name,
            message: err.message,
            code: err.code,
            response: err.response?.data,
            status: err.response?.status,
          });

          if (err.code === "ECONNREFUSED" || err.message.includes("Network")) {
            setError(
              "Cannot connect to backend. Ensure server is running on http://localhost:5000",
            );
          } else if (err.response?.status === 500) {
            setError(
              `Server error: ${err.response?.data?.message || "Unknown error"}`,
            );
          } else {
            setError(err.message || "Failed to fetch books");
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();

    return () => {
      controller?.abort?.();
    };
  }, []);

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

  const truncateText = (text, charLimit = 200) => {
    if (!text) return "";
    return text.length > charLimit
      ? text.substring(0, charLimit) + "..."
      : text;
  };

  const formatAuthors = (authors) => {
    if (!authors || !Array.isArray(authors) || authors.length === 0)
      return "Unknown Author";
    return authors.slice(0, 2).join(", ");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Date unknown";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full h-64 md:h-80 bg-gradient-to-br from-gray-50 to-white flex items-center justify-center overflow-hidden"
      >
        <div className="container-custom text-center z-10">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-serif font-bold mb-4"
          >
            Discover Books
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg opacity-70"
          >
            Explore our curated collection from Google Books
          </motion.p>
        </div>
      </motion.section>

      {/* Books Grid Section */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-200 h-96 rounded-2xl animate-pulse"
                />
              ))}
            </div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-16 gap-4"
            >
              <AlertCircle size={48} className="text-red-500" />
              <p className="text-lg text-gray-700 text-center max-w-md">
                {error}
              </p>
              <p className="text-sm text-gray-500 text-center max-w-md">
                Steps to fix:
                <br />
                1. Add GOOGLE_API_KEY to server/.env
                <br />
                2. Restart backend server
                <br />
                3. Refresh this page
              </p>
            </motion.div>
          ) : books.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-16"
            >
              <p className="text-lg text-gray-700">No books available</p>
            </motion.div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {books.map((book) => {
                if (!book || !book.id) {
                  console.warn("Invalid book object:", book);
                  return null;
                }

                const thumbnail = book.thumbnail || "";
                const title = book.title || "Untitled";
                const authors = formatAuthors(book.authors);
                const publishedDate = formatDate(book.publishedDate);
                const description = truncateText(book.description);
                const previewLink = book.previewLink || "#";

                return (
                  <motion.div
                    key={book.id}
                    variants={itemVariants}
                    whileHover={{ y: -8 }}
                    className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
                  >
                    {/* Image Container */}
                    <div className="w-full h-56 bg-neutral-100 overflow-hidden flex-shrink-0">
                      {thumbnail ? (
                        <img
                          src={thumbnail}
                          alt={title}
                          className="w-full h-full object-cover hover:scale-105 transition duration-300"
                          loading="lazy"
                          onError={(e) => {
                            console.warn("Image failed to load:", thumbnail);
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                          <span className="text-gray-500 text-sm">
                            No image
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content Container */}
                    <div className="p-5 flex flex-col flex-grow">
                      {/* Title */}
                      <h3 className="font-serif font-bold text-base md:text-lg mb-2 line-clamp-2 text-gray-900">
                        {title}
                      </h3>

                      {/* Authors */}
                      <p className="text-sm text-neutral-600 mb-1 line-clamp-1">
                        {authors}
                      </p>

                      {/* Published Date */}
                      <p className="text-xs text-neutral-500 mb-3">
                        {publishedDate}
                      </p>

                      {/* Description */}
                      {description && (
                        <p className="text-xs text-neutral-700 line-clamp-3 mb-4 flex-grow">
                          {description}
                        </p>
                      )}

                      {/* Preview Button */}
                      <a
                        href={previewLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 w-full px-4 py-2 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors duration-300 mt-auto"
                      >
                        Preview
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Destination;
