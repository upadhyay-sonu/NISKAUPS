import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../config/api";

const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await api.get("/cart");
      const items = response.data?.items || [];
      setCartItems(items);

      const sum = items.reduce((acc, item) => {
        const price = item.product?.salePrice || item.product?.price || 0;
        return acc + price * item.quantity;
      }, 0);
      setTotal(sum.toFixed(2));
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProceedToPayment = async () => {
    if (!shippingAddress.fullName || !shippingAddress.address) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const response = await api.post("/orders", {
        shippingAddress,
        paymentMethod,
      });

      if (response.data?.order) {
        navigate(`/payment/${response.data.order._id}`);
      }
    } catch (error) {
      console.error("Failed to create order:", error);
      alert("Failed to create order");
    }
  };

  if (loading) {
    return (
      <div className="container-custom py-12">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container-custom py-12">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-6">Your cart is empty</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      <h1 className="text-4xl font-serif font-bold mb-12">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping Address */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-neutral-200 rounded-2xl p-6 mb-8"
          >
            <h2 className="font-serif font-bold text-2xl mb-6">
              Shipping Address
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={shippingAddress.fullName}
                onChange={handleInputChange}
                className="col-span-2 px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={shippingAddress.email}
                onChange={handleInputChange}
                className="col-span-2 px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={shippingAddress.phone}
                onChange={handleInputChange}
                className="col-span-2 px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary"
              />
              <input
                type="text"
                name="address"
                placeholder="Street Address"
                value={shippingAddress.address}
                onChange={handleInputChange}
                className="col-span-2 px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary"
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={shippingAddress.city}
                onChange={handleInputChange}
                className="px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary"
              />
              <input
                type="text"
                name="postalCode"
                placeholder="Postal Code"
                value={shippingAddress.postalCode}
                onChange={handleInputChange}
                className="px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary"
              />
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={shippingAddress.country}
                onChange={handleInputChange}
                className="col-span-2 px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
          </motion.div>

          {/* Payment Method */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-neutral-200 rounded-2xl p-6"
          >
            <h2 className="font-serif font-bold text-2xl mb-6">
              Payment Method
            </h2>

            <div className="space-y-4">
              {["card", "upi", "net_banking"].map((method) => (
                <label
                  key={method}
                  className="flex items-center p-4 border border-neutral-200 rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="ml-3 font-medium capitalize">
                    {method === "card"
                      ? "Credit/Debit Card"
                      : method === "upi"
                        ? "UPI"
                        : "Net Banking"}
                  </span>
                </label>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky top-24 bg-white border border-neutral-200 rounded-2xl p-6"
          >
            <h2 className="font-serif font-bold text-xl mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6 pb-6 border-b border-neutral-200">
              {cartItems.map((item) => (
                <div key={item.product._id} className="flex justify-between">
                  <span className="text-sm text-gray-600 line-clamp-1">
                    {item.product.title} x {item.quantity}
                  </span>
                  <span className="font-semibold text-sm">
                    $
                    {(
                      (item.product.salePrice || item.product.price) *
                      item.quantity
                    ).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-4 mb-6 pb-6 border-b border-neutral-200">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">${total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">Free</span>
              </div>
            </div>

            <div className="flex justify-between mb-6">
              <span className="font-serif font-bold">Total</span>
              <span className="font-serif font-bold text-primary text-lg">
                ${total}
              </span>
            </div>

            <button
              onClick={handleProceedToPayment}
              className="w-full px-4 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition"
            >
              Proceed to Payment
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
