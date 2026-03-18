import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { Star, Minus, Plus, AlertCircle } from 'lucide-react';
import api from '../config/api';
import { addToCart } from '../redux/cartSlice';
import { showToast } from '../utils/toast';
import { handleImageError, PLACEHOLDER_IMAGE } from '../utils/imageHandler';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      console.log('Fetching product with ID:', id);
      const response = await api.get(`/products/${id}`);
      console.log('Product response:', response.data);
      
      if (response.data?.product) {
        setProduct(response.data.product);
        console.log('Product loaded:', response.data.product.title);
      } else {
        console.error('Invalid response structure:', response.data);
        showToast('Product data invalid', 'error');
        navigate('/');
      }
    } catch (error) {
      console.error('Failed to fetch product:', error.message);
      showToast('Product not found', 'error');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!token) {
      showToast('Please log in to add items to cart', 'error');
      navigate('/login');
      return;
    }

    dispatch(
      addToCart({
        id: product._id,
        title: product.title,
        price: product.salePrice || product.price,
        image: product.images[0]?.url,
        quantity,
      })
    );

    showToast('Added to cart successfully', 'success');
  };

  if (loading)
    return (
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-neutral-200 h-96 rounded-2xl animate-pulse" />
          <div className="space-y-4">
            <div className="bg-neutral-200 h-8 rounded-lg w-3/4 animate-pulse" />
            <div className="bg-neutral-200 h-6 rounded-lg w-1/2 animate-pulse" />
          </div>
        </div>
      </div>
    );

  if (!product) return null;

  return (
    <div className="container-custom py-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-12"
      >
        {/* Image Gallery */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="bg-neutral-50 p-4 mb-6 overflow-hidden h-96 rounded-2xl border border-neutral-200">
            {product.images[selectedImage]?.url ? (
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={product.images[selectedImage].url}
                alt={product.title}
                loading="lazy"
                crossOrigin="anonymous"
                onError={(e) => handleImageError(e, PLACEHOLDER_IMAGE)}
                className="w-full h-full object-contain cursor-zoom-in"
              />
            ) : (
              <motion.img
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={PLACEHOLDER_IMAGE}
                alt="No image available"
                className="w-full h-full object-contain"
              />
            )}
          </div>

          {/* Thumbnail gallery */}
          <div className="flex gap-3">
            {product.images.map((img, idx) => (
              <motion.button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                whileHover={{ scale: 1.05 }}
                className={`w-20 h-24 rounded-xl overflow-hidden border-2 transition ${
                  selectedImage === idx ? 'border-primary' : 'border-neutral-200'
                }`}
              >
                {img.url && (
                  <img
                    src={img.url}
                    alt={`View ${idx}`}
                    loading="lazy"
                    crossOrigin="anonymous"
                    onError={(e) => handleImageError(e, PLACEHOLDER_IMAGE)}
                    className="w-full h-full object-cover"
                  />
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">{product.title}</h1>

          <div className="mb-6">
            <p className="text-xl text-primary font-semibold mb-2">by {product.author}</p>
            <div className="flex items-center gap-4">
              {product.rating > 0 && (
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={i < Math.round(product.rating) ? 'fill-primary text-primary' : 'text-neutral-300'}
                    />
                  ))}
                </div>
              )}
              {product.totalReviews > 0 && (
                <span className="text-sm text-neutral-600">({product.totalReviews} reviews)</span>
              )}
            </div>
          </div>

          {/* Price */}
          <div className="mb-6">
            {product.salePrice ? (
              <>
                <div className="text-4xl font-bold text-primary mb-2">
                  ${product.salePrice.toFixed(2)}
                </div>
                <div className="text-lg line-through opacity-50">
                  ${product.price.toFixed(2)}
                </div>
              </>
            ) : (
              <div className="text-4xl font-bold text-primary">${product.price.toFixed(2)}</div>
            )}
          </div>

          {/* Details */}
          <div className="mb-6 pb-6 border-b border-neutral-200 space-y-2">
            <p>
              <span className="font-semibold">ISBN:</span> {product.isbn || 'N/A'}
            </p>
            <p>
              <span className="font-semibold">Publisher:</span> {product.publisher}
            </p>
            <p>
              <span className="font-semibold">Pages:</span> {product.pages}
            </p>
            <p>
              <span className="font-semibold">Language:</span> {product.language}
            </p>
            {product.isLimitedEdition && (
              <p className="text-yellow-600">
                <span className="font-semibold">Limited Edition</span> ({product.limitedCopies} copies)
              </p>
            )}
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="font-serif font-bold text-xl mb-3">Description</h3>
            <p className="opacity-70 leading-relaxed">{product.description}</p>
          </div>

          {/* Add to Cart */}
          <div className="flex gap-4">
            <div className="flex items-center border border-neutral-300 rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 hover:bg-neutral-100 transition-colors"
              >
                <Minus size={16} className="text-neutral-700" />
              </button>
              <span className="px-6 py-2 font-semibold text-center">{quantity}</span>
              <button
                onClick={() =>
                  setQuantity(Math.min(product.stock, quantity + 1))
                }
                disabled={quantity >= product.stock}
                className="p-2 hover:bg-neutral-100 transition-colors disabled:opacity-50"
              >
                <Plus size={16} className="text-neutral-700" />
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              disabled={product.stock < 1}
              className={`flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {product.stock > 0 ? `Add to Cart (${product.stock} in stock)` : 'Out of Stock'}
            </motion.button>
          </div>

          {/* Stock Status */}
          {product.stock < 5 && product.stock > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 flex items-center gap-2 text-sm text-orange-600 font-semibold bg-orange-50 p-3 rounded-lg"
            >
              <AlertCircle size={16} />
              Only {product.stock} copies left
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProductDetail;
