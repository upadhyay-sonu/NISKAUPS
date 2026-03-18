import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { Heart, ShoppingCart, Zap } from "lucide-react";
import api from "../config/api";
import { addToCart } from "../redux/cartSlice";
import { handleImageError, PLACEHOLDER_IMAGE } from "../utils/imageHandler";
import { showToast } from "../utils/toast";

const Books = () => {
    const { category } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [products, setProducts] = useState([]);
    const [favorites, setFavorites] = useState({});
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        minPrice: 0,
        maxPrice: 1000,
        sort: "newest",
    });
    const filterTimeoutRef = useRef(null);

    useEffect(() => {
        fetchProducts();
        fetchFavorites();
    }, [category]);

    // Debounced filter effect
    useEffect(() => {
        if (filterTimeoutRef.current) clearTimeout(filterTimeoutRef.current);
        filterTimeoutRef.current = setTimeout(() => {
            fetchProducts();
        }, 500);
        return () => clearTimeout(filterTimeoutRef.current);
    }, [filters]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await api.get("/products", {
                params: {
                    category,
                    minPrice: filters.minPrice,
                    maxPrice: filters.maxPrice,
                    sort: filters.sort,
                },
            });
            console.log("Products response:", response.data);
            const productsData = response.data?.products || [];
            setProducts(productsData);
            console.log("Set products count:", productsData.length);
        } catch (error) {
            console.error("Failed to fetch products:", error);
            setProducts([]);
        }
        setLoading(false);
    };

    const fetchFavorites = async () => {
        try {
            const token = localStorage.getItem("token");
            
            if (!token) {
                console.log("User not logged in → skipping favorites fetch");
                return;
            }

            const response = await api.get("/favorites");
            const favIds = {};
            response.data?.products?.forEach((product) => {
                favIds[product._id] = true;
            });
            setFavorites(favIds);
        } catch (error) {
            console.error("Failed to fetch favorites:", error);
        }
    };

    const handleAddToCart = async (product) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                showToast("Please log in to add items to cart", "error");
                navigate("/login");
                return;
            }

            // Add to backend
            const response = await api.post("/cart/add", {
                product: product._id,
                quantity: 1,
            });

            if (response.data?.success) {
                // Sync with Redux
                dispatch(
                    addToCart({
                        id: product._id,
                        title: product.title,
                        price: product.salePrice || product.price,
                        image: product.images[0]?.url,
                        quantity: 1,
                    })
                );
                showToast(`${product.title} added to cart!`, "success");
            }
        } catch (error) {
            console.error("Failed to add to cart:", error);
            showToast("Failed to add to cart", "error");
        }
    };

    const handleBuyNow = async (product) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }

            await api.post("/cart/add", {
                product: product._id,
                quantity: 1,
            });

            navigate("/checkout");
        } catch (error) {
            console.error("Failed to process buy now:", error);
            alert("Failed to process purchase");
        }
    };

    const handleToggleFavorite = async (product) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }

            if (favorites[product._id]) {
                await api.delete(`/favorites/remove/${product._id}`);
                setFavorites((prev) => {
                    const updated = { ...prev };
                    delete updated[product._id];
                    return updated;
                });
            } else {
                await api.post(`/favorites/add/${product._id}`);
                setFavorites((prev) => ({
                    ...prev,
                    [product._id]: true,
                }));
            }
        } catch (error) {
            console.error("Failed to toggle favorite:", error);
        }
    };

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
        <div className="container-custom py-12">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
            >
                <h1 className="text-4xl md:text-5xl font-serif font-bold mb-2 capitalize">
                    {category === "coming-soon" ? "Coming Soon" : category}
                </h1>
                <p className="text-lg opacity-70">Explore our {category} collection</p>
            </motion.div>

            {/* Filters & Products */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Sidebar - Filters */}
                <motion.aside
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="md:col-span-1"
                >
                    <div className="bg-white border border-neutral-200 rounded-2xl p-6">
                        <h3 className="font-serif font-bold text-lg mb-6">Filters</h3>

                        {/* Price Range */}
                        <div className="mb-8">
                            <label className="block font-semibold mb-3">Price Range</label>
                            <div className="space-y-2">
                                <input
                                    type="range"
                                    min="0"
                                    max="1000"
                                    value={filters.maxPrice}
                                    onChange={(e) =>
                                        setFilters({
                                            ...filters,
                                            maxPrice: parseInt(e.target.value),
                                        })
                                    }
                                    className="w-full"
                                />
                                <div className="flex justify-between text-sm">
                                    <span>${filters.minPrice}</span>
                                    <span>${filters.maxPrice}</span>
                                </div>
                            </div>
                        </div>

                        {/* Sort */}
                        <div>
                            <label className="block font-semibold mb-3">Sort By</label>
                            <select
                                value={filters.sort}
                                onChange={(e) =>
                                    setFilters({ ...filters, sort: e.target.value })
                                }
                                className="w-full"
                            >
                                <option value="newest">Newest</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="best-selling">Best Selling</option>
                            </select>
                        </div>
                    </div>
                </motion.aside>

                {/* Products Grid */}
                <div className="md:col-span-3">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[...Array(6)].map((_, i) => (
                                <div
                                    key={i}
                                    className="bg-neutral-200 h-96 rounded-2xl animate-pulse"
                                />
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={staggerContainer}
                            className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        >
                            {products.length > 0 ? (
                                products.map((product) => (
                                    <motion.div
                                        key={product._id}
                                        variants={itemVariants}
                                        whileHover={{ y: -10 }}
                                        className="bg-white border border-neutral-200 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col"
                                    >
                                        <Link to={`/product/${product._id}`}>
                                            <div className="w-full h-72 bg-neutral-100 overflow-hidden relative group">
                                                {product.images?.[0]?.url ? (
                                                    <img
                                                        src={product.images[0].url}
                                                        alt={product.title}
                                                        loading="lazy"
                                                        crossOrigin="anonymous"
                                                        onError={(e) => handleImageError(e, PLACEHOLDER_IMAGE)}
                                                        className="w-full h-full object-cover hover:scale-110 transition duration-500"
                                                    />
                                                ) : (
                                                    <img
                                                        src={PLACEHOLDER_IMAGE}
                                                        alt="No image available"
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}

                                                {/* Favorite Button - Overlay */}
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleToggleFavorite(product);
                                                    }}
                                                    className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all"
                                                >
                                                    <Heart
                                                        size={20}
                                                        className={`transition-colors ${favorites[product._id]
                                                                ? "fill-red-500 text-red-500"
                                                                : "text-gray-400 hover:text-red-500"
                                                            }`}
                                                    />
                                                </button>
                                            </div>
                                        </Link>

                                        <div className="p-4 flex flex-col flex-grow">
                                            <Link to={`/product/${product._id}`}>
                                                <h3 className="font-serif font-bold text-lg mb-1 line-clamp-2 hover:text-primary">
                                                    {product.title}
                                                </h3>
                                                <p className="text-sm text-neutral-600 mb-2">
                                                    {product.author}
                                                </p>
                                                <p className="text-xs text-neutral-500 mb-3">
                                                    {product.sku}
                                                </p>
                                            </Link>

                                            <div className="flex justify-between items-center mb-4">
                                                <div>
                                                    {product.salePrice ? (
                                                        <>
                                                            <span className="text-primary font-bold">
                                                                ${product.salePrice.toFixed(2)}
                                                            </span>
                                                            <span className="text-xs text-neutral-500 line-through ml-2">
                                                                ${product.price.toFixed(2)}
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span className="text-primary font-bold">
                                                            ${product.price.toFixed(2)}
                                                        </span>
                                                    )}
                                                </div>
                                                {product.isLimitedEdition && (
                                                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                                                        Limited
                                                    </span>
                                                )}
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex gap-2 mt-auto">
                                                <button
                                                    onClick={() => handleAddToCart(product)}
                                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors"
                                                >
                                                    <ShoppingCart size={16} />
                                                    <span className="hidden sm:inline">Add</span>
                                                </button>
                                                <button
                                                    onClick={() => handleBuyNow(product)}
                                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors"
                                                >
                                                    <Zap size={16} />
                                                    <span className="hidden sm:inline">Buy</span>
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-12">
                                    <p className="text-lg opacity-70">No products found</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Books;
