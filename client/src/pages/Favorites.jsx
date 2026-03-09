import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingCart } from "lucide-react";
import api from "../config/api";

const Favorites = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await api.get("/favorites");
      setFavorites(response.data?.products || []);
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (productId) => {
    try {
      await api.delete(`/favorites/remove/${productId}`);
      setFavorites(favorites.filter((item) => item._id !== productId));
    } catch (error) {
      console.error("Failed to remove favorite:", error);
      alert("Failed to remove favorite");
    }
  };

  const handleAddToCart = async (product) => {
    try {
      await api.post("/cart/add", {
        product: product._id,
        quantity: 1,
      });
      alert(`${product.title} added to cart!`);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      alert("Failed to add to cart");
    }
  };

  if (loading) {
    return (
      <div className="container-custom py-12">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      <h1 className="text-4xl font-serif font-bold mb-12">My Favorites</h1>

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600 mb-6">
            You haven't added any favorites yet
          </p>
          <Link
            to="/books/current"
            className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark"
          >
            Browse Books
          </Link>
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {favorites.map((product) => (
            <motion.div
              key={product._id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="bg-white border border-neutral-200 rounded-2xl overflow-hidden"
            >
              <Link to={`/product/${product._id}`}>
                <div className="w-full h-64 bg-gray-100 overflow-hidden">
                  {product.images?.[0]?.url ? (
                    <img
                      src={product.images[0].url}
                      alt={product.title}
                      className="w-full h-full object-cover hover:scale-110 transition duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No image
                    </div>
                  )}
                </div>
              </Link>

              <div className="p-4">
                <Link to={`/product/${product._id}`}>
                  <h3 className="font-serif font-bold text-lg mb-2 line-clamp-2 hover:text-primary">
                    {product.title}
                  </h3>
                </Link>
                <p className="text-sm text-neutral-600 mb-4">
                  {product.author}
                </p>
                <p className="text-primary font-bold mb-4">
                  ${(product.salePrice || product.price).toFixed(2)}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
                  >
                    <ShoppingCart size={16} />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleRemoveFavorite(product._id)}
                    className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                  >
                    <Heart size={18} className="fill-red-500" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Favorites;
