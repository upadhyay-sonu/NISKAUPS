import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import api from "../config/api";

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      setOrder(response.data?.order);
    } catch (error) {
      console.error("Failed to fetch order:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container-custom py-12">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container-custom py-12">
        <div className="text-center text-red-600">Order not found</div>
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-6"
        >
          <CheckCircle className="text-green-600" size={64} />
        </motion.div>

        {/* Title */}
        <h1 className="text-4xl font-serif font-bold mb-4">
          Order Confirmed!
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Thank you for your purchase. Your order has been confirmed and is now
          being processed.
        </p>

        {/* Order Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-neutral-200 rounded-2xl p-8 mb-8"
        >
          <div className="grid grid-cols-2 gap-6 mb-8 pb-8 border-b border-neutral-200">
            <div className="text-left">
              <p className="text-sm text-gray-600 mb-2">Order ID</p>
              <p className="font-mono font-bold text-lg">
                {order._id}
              </p>
            </div>
            <div className="text-left">
              <p className="text-sm text-gray-600 mb-2">Order Date</p>
              <p className="font-semibold">
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Items */}
          <div className="mb-8 pb-8 border-b border-neutral-200 text-left">
            <p className="font-bold text-lg mb-4">Order Items</p>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.product} className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center text-left">
            <p className="font-serif font-bold text-lg">Total Amount</p>
            <p className="font-serif font-bold text-2xl text-primary">
              ${order.totalPrice.toFixed(2)}
            </p>
          </div>

          {/* Shipping Address */}
          <div className="mt-8 pt-8 border-t border-neutral-200 text-left">
            <p className="font-bold text-lg mb-4">Shipping Address</p>
            <div className="text-gray-700">
              <p>{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.address}</p>
              <p>
                {order.shippingAddress.city},{" "}
                {order.shippingAddress.postalCode}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/orders"
            className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition"
          >
            View All Orders
          </Link>
          <Link
            to="/books/current"
            className="px-6 py-3 bg-gray-100 text-gray-800 font-medium rounded-lg hover:bg-gray-200 transition"
          >
            Continue Shopping
          </Link>
        </motion.div>

        {/* Additional Info */}
        <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-2xl text-left">
          <p className="text-sm text-blue-900">
            <strong>What happens next?</strong> You'll receive an email confirmation
            shortly. Your order will be shipped within 3-5 business days. You can
            track your order status in the "My Orders" section.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderConfirmation;
