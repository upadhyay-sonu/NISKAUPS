import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Trash2, Plus, Minus } from "lucide-react";
import api from "../config/api";

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    calculateTotal();
  }, [cartItems]);

  const fetchCart = async () => {
    try {
      const response = await api.get("/cart");
      setCartItems(response.data?.items || []);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    const sum = cartItems.reduce((acc, item) => {
      const price = item.product?.salePrice || item.product?.price || 0;
      return acc + price * item.quantity;
    }, 0);
    setTotal(sum.toFixed(2));
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      await api.put(`/cart/update/${productId}`, { quantity: newQuantity });
      const updated = cartItems.map((item) =>
        item.product._id === productId
          ? { ...item, quantity: newQuantity }
          : item,
      );
      setCartItems(updated);
    } catch (error) {
      console.error("Failed to update quantity:", error);
      alert("Failed to update quantity");
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await api.delete(`/cart/remove/${productId}`);
      setCartItems(cartItems.filter((item) => item.product._id !== productId));
    } catch (error) {
      console.error("Failed to remove item:", error);
      alert("Failed to remove item");
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Cart is empty");
      return;
    }
    navigate("/checkout");
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
      <h1 className="text-4xl font-serif font-bold mb-12">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600 mb-6">Your cart is empty</p>
          <Link
            to="/books/current"
            className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <motion.div
                  key={item.product._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-4 p-4 bg-white border border-neutral-200 rounded-2xl"
                >
                  {/* Product Image */}
                  <Link
                    to={`/product/${item.product._id}`}
                    className="flex-shrink-0"
                  >
                    <img
                      src={item.product.images[0]?.url}
                      alt={item.product.title}
                      className="w-24 h-32 object-cover rounded-lg"
                    />
                  </Link>

                  {/* Product Details */}
                  <div className="flex-grow">
                    <Link to={`/product/${item.product._id}`}>
                      <h3 className="font-serif font-bold text-lg mb-2 hover:text-primary">
                        {item.product.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-neutral-600 mb-2">
                      {item.product.author}
                    </p>
                    <p className="font-bold text-primary">
                      ${(
                        (item.product.salePrice || item.product.price) *
                        item.quantity
                      ).toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity and Actions */}
                  <div className="flex flex-col items-end gap-4">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-neutral-300 rounded-lg">
                      <button
                        onClick={() =>
                          handleUpdateQuantity(
                            item.product._id,
                            item.quantity - 1,
                          )
                        }
                        className="p-2 hover:bg-gray-100"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-4 py-2 font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleUpdateQuantity(
                            item.product._id,
                            item.quantity + 1,
                          )
                        }
                        className="p-2 hover:bg-gray-100"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item.product._id)}
                      className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 size={16} />
                      <span className="text-sm">Remove</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white border border-neutral-200 rounded-2xl p-6">
              <h2 className="font-serif font-bold text-xl mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-neutral-200">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">${total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">$0.00</span>
                </div>
              </div>

              <div className="flex justify-between mb-6">
                <span className="font-serif font-bold text-lg">Total</span>
                <span className="font-serif font-bold text-lg text-primary">
                  ${total}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full px-4 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition"
              >
                Proceed to Checkout
              </button>

              <Link
                to="/books/current"
                className="block text-center mt-4 text-primary hover:underline"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
