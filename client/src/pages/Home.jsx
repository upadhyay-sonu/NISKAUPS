import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BookOpen, PenTool, Sparkles, ArrowRight } from "lucide-react";
import api from "../config/api";

const Home = () => {
  const { user } = useSelector((state) => state.auth);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get("/products/featured");
        console.log("Featured products response:", response.data);

        const productsData = response.data?.products || [];
        console.log("Products array:", productsData);
        console.log("Products count:", productsData.length);

        setProducts(Array.isArray(productsData) ? productsData : []);
      } catch (err) {
        console.error("Failed to fetch featured products:", {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
        });
        setError(err.message || "Failed to load featured products");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const heroVariants = {
    hidden: { opacity: 0, scale: 1.05 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8 },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={heroVariants}
        className="relative w-full h-96 md:h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url('https://img.freepik.com/premium-photo/person-sitting-by-window-with-open-book-watercolor-faded-memories-sadness_1302739-24792.jpg?semt=ais_hybrid&w=740&q=80')`
        }}
      >
        <div className="absolute inset-0 bg-black/60 z-0"></div>
        <div className="container-custom text-center z-10 text-white">
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-serif font-bold mb-6 text-white"
          >
            Discover Literary Excellence
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto text-gray-200"
          >
            Curated collections of extraordinary books for the discerning reader
          </motion.p>
          <motion.div variants={itemVariants}>
            <Link
              to="/books/current"
              className="inline-flex items-center gap-2 btn-primary text-lg md:text-xl"
            >
              Explore Collections
              <ArrowRight size={24} />
            </Link>
          </motion.div>
        </div>

        {/* Animated background elements */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-10 right-10 w-72 h-72 bg-white flex opacity-10 rounded-full blur-3xl z-0"
        />
      </motion.section>

      {/* Featured Collections */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif font-bold mb-12 text-center"
          >
            Collections
          </motion.h2>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                name: "Current Selection",
                path: "/books/current",
                Icon: BookOpen,
                desc: "Our latest and most popular titles",
              },
              {
                name: "Signed Books",
                path: "/books/signed",
                Icon: PenTool,
                desc: "Autographed editions from renowned authors",
              },
              {
                name: "Special Editions",
                path: "/books/special",
                Icon: Sparkles,
                desc: "Limited and collector edition volumes",
              },
            ].map((collection, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="group relative bg-white rounded-2xl border border-neutral-200 p-8 text-center cursor-pointer shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex justify-center mb-6">
                  <collection.Icon size={24} className="text-neutral-700" />
                </div>
                <h3 className="text-2xl font-serif font-bold mb-3">
                  {collection.name}
                </h3>
                <p className="text-neutral-600 mb-6 text-sm leading-relaxed">
                  {collection.desc}
                </p>
                <Link
                  to={collection.path}
                  className="inline-flex items-center gap-2 text-neutral-700 font-medium hover:text-primary transition-colors duration-300 group"
                >
                  Explore
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform duration-300"
                  />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="py-16 md:py-24 bg-accent">
        <div className="container-custom">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif font-bold mb-12 text-center"
          >
            Featured Books
          </motion.h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-200 h-96 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-lg text-red-600">{error}</p>
            </div>
          ) : !products || products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">
                No featured products available
              </p>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {products.map((product) => (
                <motion.div
                  key={product._id}
                  variants={itemVariants}
                  whileHover={{ y: -10 }}
                  className="card-glass overflow-hidden"
                >
                  <Link to={`/product/${product._id}`} className="block">
                    <div className="w-full h-64 bg-gray-100 overflow-hidden">
                      {product.images &&
                      product.images.length > 0 &&
                      product.images[0]?.url ? (
                        <img
                          src={product.images[0].url}
                          alt={product.title || "Product"}
                          className="w-full h-full object-cover hover:scale-110 transition duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200">
                          No image available
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-serif font-bold text-lg mb-2 line-clamp-2">
                        {product.title || "Untitled"}
                      </h3>
                      <p className="text-sm opacity-70 mb-2">
                        {product.author || "Unknown Author"}
                      </p>
                      <div className="flex justify-between items-center">
                        <div>
                          {product.salePrice && product.salePrice > 0 ? (
                            <>
                              <span className="text-primary font-bold">
                                ${product.salePrice.toFixed(2)}
                              </span>
                              <span className="text-xs opacity-50 line-through ml-2">
                                ${product.price?.toFixed(2) || "N/A"}
                              </span>
                            </>
                          ) : (
                            <span className="text-primary font-bold">
                              ${product.price?.toFixed(2) || "N/A"}
                            </span>
                          )}
                        </div>
                        {product.stock > 0 ? (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                            In stock
                          </span>
                        ) : (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                            Out of stock
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      {!user && (
        <section className="py-16 md:py-24">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto text-center"
            >
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
                Stay Updated
              </h2>
              <p className="text-lg opacity-70 mb-8">
                Subscribe to our newsletter for exclusive releases and
                recommendations
              </p>
              <div className="flex gap-2 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg"
                />
                <button className="btn-primary">Subscribe</button>
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
