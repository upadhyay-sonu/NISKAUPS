import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Clock,
  XCircle,
  ShoppingBag,
  Eye,
  Filter,
} from "lucide-react";
import api from "../config/api";

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get("/orders");
      setOrders(response.data?.orders || []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    const iconProps = { size: 20 };
    switch (status) {
      case "delivered":
        return <CheckCircle className="text-green-600" {...iconProps} />;
      case "shipped":
        return <Clock className="text-blue-600" {...iconProps} />;
      case "pending":
      case "confirmed":
        return <Clock className="text-yellow-600" {...iconProps} />;
      case "cancelled":
        return <XCircle className="text-red-600" {...iconProps} />;
      default:
        return <Clock className="text-gray-600" {...iconProps} />;
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-700 border-green-300";
      case "shipped":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "confirmed":
        return "bg-purple-100 text-purple-700 border-purple-300";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "failed":
        return "bg-red-100 text-red-700";
      case "refunded":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Filter orders
  const filteredOrders =
    filterStatus === "all"
      ? orders
      : orders.filter((order) => order.orderStatus === filterStatus);

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const endIndex = startIndex + ordersPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="container-custom py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container-custom py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-serif font-bold mb-2">My Orders</h1>
          <p className="text-neutral-600">View and track your orders</p>
        </div>

        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-neutral-200 rounded-2xl p-16 text-center"
          >
            <ShoppingBag size={64} className="mx-auto text-neutral-400 mb-6" />
            <h2 className="text-2xl font-serif font-bold mb-4">
              No Orders Yet
            </h2>
            <p className="text-neutral-600 mb-8 max-w-md mx-auto">
              You haven't placed any orders yet. Start exploring our collection
              and find your next favorite book!
            </p>
            <Link
              to="/books/current"
              className="inline-block px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-semibold"
            >
              Start Shopping
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Filter Bar */}
            <div className="mb-8 bg-white rounded-xl p-6 border border-neutral-200">
              <div className="flex items-center gap-4 flex-wrap">
                <Filter size={20} className="text-neutral-600" />
                <span className="font-semibold text-neutral-700">
                  Filter by Status:
                </span>
                <div className="flex gap-2 flex-wrap">
                  {[
                    "all",
                    "pending",
                    "confirmed",
                    "shipped",
                    "delivered",
                    "cancelled",
                  ].map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setFilterStatus(status);
                        setCurrentPage(1);
                      }}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                        filterStatus === status
                          ? "bg-primary text-white"
                          : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
                <div className="ml-auto text-sm text-neutral-600">
                  Showing {paginatedOrders.length} of {filteredOrders.length}{" "}
                  orders
                </div>
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {paginatedOrders.map((order) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -2 }}
                  className="bg-white border border-neutral-200 rounded-xl p-6 hover:shadow-lg transition-all"
                >
                  {/* Top Row - Main Info */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
                    {/* Order ID and Date */}
                    <div>
                      <p className="text-xs font-semibold text-neutral-500 uppercase">
                        Order ID
                      </p>
                      <p className="font-mono font-bold text-lg mt-2">
                        {order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-xs text-neutral-500 mt-2">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>

                    {/* Order Status */}
                    <div>
                      <p className="text-xs font-semibold text-neutral-500 uppercase">
                        Order Status
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        {getStatusIcon(order.orderStatus)}
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusBadgeClass(
                            order.orderStatus,
                          )}`}
                        >
                          {order.orderStatus.charAt(0).toUpperCase() +
                            order.orderStatus.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* Payment Status */}
                    <div>
                      <p className="text-xs font-semibold text-neutral-500 uppercase">
                        Payment
                      </p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-2 ${getPaymentStatusColor(
                          order.paymentStatus,
                        )}`}
                      >
                        {order.paymentStatus.charAt(0).toUpperCase() +
                          order.paymentStatus.slice(1)}
                      </span>
                    </div>

                    {/* Total Price */}
                    <div>
                      <p className="text-xs font-semibold text-neutral-500 uppercase">
                        Total
                      </p>
                      <p className="text-3xl font-bold text-primary mt-2">
                        ${order.totalPrice.toFixed(2)}
                      </p>
                    </div>

                    {/* Action Button */}
                    <div className="flex items-end">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-semibold flex items-center justify-center gap-2"
                      >
                        <Eye size={18} />
                        View Details
                      </button>
                    </div>
                  </div>

                  {/* Items Preview */}
                  <div className="border-t border-neutral-200 pt-6">
                    <p className="text-xs font-semibold text-neutral-500 uppercase mb-4">
                      Items ({order.items.length})
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {order.items.map((item) => (
                        <div key={item.product} className="group">
                          {item.image && (
                            <div className="relative overflow-hidden rounded-lg mb-2 bg-neutral-100">
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-24 object-cover group-hover:scale-105 transition-transform"
                              />
                            </div>
                          )}
                          <p className="text-sm font-medium line-clamp-2 text-neutral-900">
                            {item.title}
                          </p>
                          <p className="text-xs text-neutral-500 mt-1">
                            Qty: {item.quantity}
                          </p>
                          <p className="text-sm font-bold text-primary mt-1">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                          currentPage === page
                            ? "bg-primary text-white"
                            : "border border-neutral-200 hover:bg-neutral-100"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

// Order Details Modal Component
const OrderDetailsModal = ({ order, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-neutral-200 px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-serif font-bold">Order Details</h2>
            <p className="text-neutral-600 text-sm">
              Order ID: {order._id.slice(-8).toUpperCase()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-3xl text-neutral-600 hover:text-neutral-900 font-light"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Timeline */}
          <div className="bg-neutral-50 rounded-xl p-6">
            <h3 className="font-serif font-bold text-lg mb-6">
              Order Timeline
            </h3>
            <div className="space-y-4">
              {["Ordered", "Confirmed", "Shipped", "Delivered"].map(
                (step, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="relative flex flex-col items-center">
                      <div
                        className={`w-4 h-4 rounded-full border-2 ${
                          idx === 0
                            ? "bg-primary border-primary"
                            : "bg-white border-neutral-300"
                        }`}
                      />
                      {idx < 3 && (
                        <div
                          className={`w-1 h-12 ${
                            idx === 0 ? "bg-primary" : "bg-neutral-300"
                          }`}
                        />
                      )}
                    </div>
                    <div className="pt-1">
                      <p
                        className={`font-semibold ${idx === 0 ? "text-primary" : ""}`}
                      >
                        {step}
                      </p>
                      {idx === 0 && (
                        <p className="text-sm text-neutral-600 mt-1">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Order & Shipping Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Order Information */}
            <div>
              <h3 className="font-serif font-bold text-lg mb-4">
                Order Information
              </h3>
              <div className="space-y-4 bg-neutral-50 rounded-lg p-4">
                <div className="border-b border-neutral-200 pb-3">
                  <p className="text-xs font-semibold text-neutral-500 uppercase">
                    Date
                  </p>
                  <p className="mt-1 font-medium">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="border-b border-neutral-200 pb-3">
                  <p className="text-xs font-semibold text-neutral-500 uppercase">
                    Status
                  </p>
                  <p className="mt-1 font-medium capitalize">
                    {order.orderStatus}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-500 uppercase">
                    Payment Method
                  </p>
                  <p className="mt-1 font-medium capitalize">
                    {order.paymentMethod}
                  </p>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div>
              <h3 className="font-serif font-bold text-lg mb-4">
                Shipping Address
              </h3>
              <div className="bg-neutral-50 rounded-lg p-4 space-y-2 text-sm">
                <p className="font-semibold">
                  {order.shippingAddress?.fullName}
                </p>
                <p className="text-neutral-700">
                  {order.shippingAddress?.address}
                </p>
                <p className="text-neutral-700">
                  {order.shippingAddress?.city},{" "}
                  {order.shippingAddress?.postalCode}
                </p>
                <p className="text-neutral-700">
                  {order.shippingAddress?.country}
                </p>
                <div className="pt-2 border-t border-neutral-200">
                  <p className="text-neutral-600">
                    {order.shippingAddress?.email}
                  </p>
                  <p className="text-neutral-600">
                    {order.shippingAddress?.phone}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="font-serif font-bold text-lg mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex gap-4 pb-4 border-b border-neutral-200 last:border-0"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-24 h-32 object-cover rounded-lg flex-shrink-0"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-2">{item.title}</h4>
                    <div className="space-y-1 text-neutral-600 mb-3">
                      <p className="text-sm">
                        Quantity:{" "}
                        <span className="font-semibold">{item.quantity}</span>
                      </p>
                      <p className="text-sm">
                        Price per item:{" "}
                        <span className="font-semibold">
                          ${item.price.toFixed(2)}
                        </span>
                      </p>
                    </div>
                    <p className="text-primary font-bold text-lg">
                      Subtotal: ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200">
            <h3 className="font-serif font-bold text-lg mb-4">Order Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-neutral-700">
                <span>Subtotal ({order.items.length} items):</span>
                <span className="font-semibold">
                  ${order.totalPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-neutral-700">
                <span>Shipping:</span>
                <span className="font-semibold">Free</span>
              </div>
              <div className="flex justify-between text-neutral-700">
                <span>Tax:</span>
                <span className="font-semibold">Included</span>
              </div>
              <div className="border-t border-neutral-200 pt-3 flex justify-between font-bold text-lg">
                <span>Total Order Price:</span>
                <span className="text-primary text-2xl">
                  ${order.totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white border border-neutral-200 rounded-xl p-6">
            <h3 className="font-serif font-bold text-lg mb-4">
              Payment Information
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-neutral-700 font-medium">
                  Payment Status:
                </span>
                <span
                  className={`font-semibold px-4 py-2 rounded-full text-sm ${
                    order.paymentStatus === "completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {order.paymentStatus.charAt(0).toUpperCase() +
                    order.paymentStatus.slice(1)}
                </span>
              </div>
              {order.transactionId && (
                <div className="flex justify-between items-center pt-3 border-t border-neutral-200">
                  <span className="text-neutral-700 font-medium">
                    Transaction ID:
                  </span>
                  <span className="font-mono text-sm bg-neutral-50 px-3 py-1 rounded">
                    {order.transactionId}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-200 p-6 bg-neutral-50">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-semibold"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Orders;
