import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import {
  LogOut,
  ShoppingBag,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
} from "lucide-react";
import api from "../config/api";
import { logout } from "../redux/authSlice";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("profile");
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchOrders();
  }, [token]);

  const fetchOrders = async () => {
    try {
      const response = await api.get("/orders");
      setOrders(response.data?.orders || []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
      confirmed: "bg-blue-100 text-blue-700 border-blue-300",
      shipped: "bg-purple-100 text-purple-700 border-purple-300",
      delivered: "bg-green-100 text-green-700 border-green-300",
      cancelled: "bg-red-100 text-red-700 border-red-300",
    };
    return colors[status] || colors.pending;
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-700",
      completed: "bg-green-100 text-green-700",
      failed: "bg-red-100 text-red-700",
      refunded: "bg-blue-100 text-blue-700",
    };
    return colors[status] || colors.pending;
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Clock size={18} />,
      confirmed: <ShoppingBag size={18} />,
      shipped: <AlertCircle size={18} />,
      delivered: <CheckCircle size={18} />,
      cancelled: <AlertCircle size={18} />,
    };
    return icons[status] || <ShoppingBag size={18} />;
  };

  // Pagination
  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const endIndex = startIndex + ordersPerPage;
  const paginatedOrders = orders.slice(startIndex, endIndex);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-neutral-50"
    >
      <div className="container-custom py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-serif font-bold mb-2">My Account</h1>
          <p className="text-neutral-600">
            Manage your profile and order history
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8 border-b border-neutral-200">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("profile")}
              className={`pb-4 font-semibold transition-colors ${
                activeTab === "profile"
                  ? "border-b-2 border-primary text-primary"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`pb-4 font-semibold transition-colors ${
                activeTab === "orders"
                  ? "border-b-2 border-primary text-primary"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              My Orders ({orders.length})
            </button>
          </div>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* Profile Info */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-8">
              <h2 className="font-serif font-bold text-2xl mb-6">
                Profile Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-neutral-600">
                    Name
                  </label>
                  <p className="text-lg mt-1">{user?.name}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-neutral-600">
                    Email
                  </label>
                  <p className="text-lg mt-1">{user?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-neutral-600">
                    Account Type
                  </label>
                  <p className="text-lg mt-1 capitalize">{user?.role}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-neutral-600">
                    Member Since
                  </label>
                  <p className="text-lg mt-1">
                    {new Date(user?.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="mt-8 w-full flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors font-semibold"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <div className="bg-white border border-neutral-200 rounded-2xl p-8">
                <h2 className="font-serif font-bold text-2xl mb-6">
                  Order Summary
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-neutral-200">
                    <span className="text-neutral-600">Total Orders</span>
                    <span className="text-2xl font-bold">{orders.length}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-neutral-200">
                    <span className="text-neutral-600">Delivered</span>
                    <span className="text-2xl font-bold">
                      {
                        orders.filter((o) => o.orderStatus === "delivered")
                          .length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">In Progress</span>
                    <span className="text-2xl font-bold">
                      {
                        orders.filter(
                          (o) =>
                            o.orderStatus === "pending" ||
                            o.orderStatus === "confirmed" ||
                            o.orderStatus === "shipped",
                        ).length
                      }
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-neutral-200 rounded-2xl p-8">
                <h3 className="font-serif font-bold text-xl mb-4">
                  Total Spent
                </h3>
                <p className="text-4xl font-bold text-primary">
                  $
                  {orders
                    .reduce((sum, order) => sum + order.totalPrice, 0)
                    .toFixed(2)}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-serif font-bold mb-6">My Orders</h2>

            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-neutral-200 h-32 rounded-2xl animate-pulse"
                  />
                ))}
              </div>
            ) : orders.length > 0 ? (
              <>
                <div className="space-y-4">
                  {paginatedOrders.map((order) => (
                    <motion.div
                      key={order._id}
                      whileHover={{ y: -2 }}
                      className="bg-white border border-neutral-200 rounded-xl p-6 hover:shadow-lg transition-all"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
                        {/* Order ID and Date */}
                        <div>
                          <p className="text-xs font-semibold text-neutral-500 uppercase">
                            Order ID
                          </p>
                          <p className="font-mono font-bold mt-1">
                            {order._id.slice(-8).toUpperCase()}
                          </p>
                          <p className="text-xs text-neutral-500 mt-2">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>

                        {/* Order Status */}
                        <div>
                          <p className="text-xs font-semibold text-neutral-500 uppercase">
                            Order Status
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span
                              className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.orderStatus)}`}
                            >
                              {getStatusIcon(order.orderStatus)}
                              {order.orderStatus.charAt(0).toUpperCase() +
                                order.orderStatus.slice(1)}
                            </span>
                          </div>
                        </div>

                        {/* Payment Status */}
                        <div>
                          <p className="text-xs font-semibold text-neutral-500 uppercase">
                            Payment Status
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
                            Total Price
                          </p>
                          <p className="text-2xl font-bold text-primary mt-1">
                            ${order.totalPrice.toFixed(2)}
                          </p>
                        </div>

                        {/* Action Button */}
                        <div className="flex items-end">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-semibold flex items-center justify-center gap-2"
                          >
                            <Eye size={16} />
                            View Details
                          </button>
                        </div>
                      </div>

                      {/* Items Preview */}
                      <div className="border-t border-neutral-200 pt-4">
                        <p className="text-xs font-semibold text-neutral-500 uppercase mb-3">
                          Items ({order.items.length})
                        </p>
                        <div className="flex gap-4 overflow-x-auto">
                          {order.items.map((item) => (
                            <div key={item.product} className="flex-shrink-0">
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="w-16 h-20 object-cover rounded"
                                />
                              )}
                              <p className="text-xs font-medium mt-2 max-w-[80px] line-clamp-1">
                                {item.title}
                              </p>
                              <p className="text-xs text-neutral-500">
                                Qty: {item.quantity}
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
                  <div className="flex justify-center gap-2 mt-8">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-neutral-200 rounded-lg disabled:opacity-50"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-4 py-2 rounded-lg ${
                            currentPage === page
                              ? "bg-primary text-white"
                              : "border border-neutral-200 hover:bg-neutral-100"
                          }`}
                        >
                          {page}
                        </button>
                      ),
                    )}
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-neutral-200 rounded-lg disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center">
                <ShoppingBag
                  size={48}
                  className="mx-auto text-neutral-400 mb-4"
                />
                <p className="text-neutral-600 mb-6">No orders yet</p>
                <a
                  href="/books/current"
                  className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-semibold"
                >
                  Start Shopping
                </a>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </motion.div>
  );
};

// Order Details Modal Component
const OrderDetailsModal = ({ order, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-neutral-200 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-serif font-bold">Order Details</h2>
            <p className="text-neutral-600 mt-1">
              Order ID: {order._id.slice(-8).toUpperCase()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-2xl text-neutral-600 hover:text-neutral-900"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Timeline */}
          <div className="bg-neutral-50 rounded-xl p-6">
            <h3 className="font-serif font-bold text-lg mb-4">
              Order Timeline
            </h3>
            <div className="space-y-4">
              {["Ordered", "Confirmed", "Shipped", "Delivered"].map(
                (step, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="relative flex flex-col items-center">
                      <div
                        className={`w-4 h-4 rounded-full ${
                          idx === 0 ? "bg-primary" : "bg-neutral-300"
                        }`}
                      />
                      {idx < 3 && (
                        <div
                          className={`w-1 h-8 ${
                            idx === 0 ? "bg-primary" : "bg-neutral-300"
                          }`}
                        />
                      )}
                    </div>
                    <div className="pt-1">
                      <p className="font-semibold">{step}</p>
                      {idx === 0 && (
                        <p className="text-sm text-neutral-600">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Order Information */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-serif font-bold text-lg mb-4">
                Order Information
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-neutral-500 uppercase">
                    Date Ordered
                  </p>
                  <p className="mt-1">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-500 uppercase">
                    Order Status
                  </p>
                  <p className="mt-1 capitalize font-semibold">
                    {order.orderStatus}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-500 uppercase">
                    Payment Method
                  </p>
                  <p className="mt-1 capitalize">{order.paymentMethod}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-serif font-bold text-lg mb-4">
                Shipping Address
              </h3>
              <div className="space-y-1 text-sm">
                <p className="font-semibold">
                  {order.shippingAddress?.fullName}
                </p>
                <p>{order.shippingAddress?.address}</p>
                <p>
                  {order.shippingAddress?.city},{" "}
                  {order.shippingAddress?.postalCode}
                </p>
                <p>{order.shippingAddress?.country}</p>
                <p className="mt-2 text-neutral-600">
                  {order.shippingAddress?.email}
                </p>
                <p className="text-neutral-600">
                  {order.shippingAddress?.phone}
                </p>
              </div>
            </div>
          </div>

          {/* Items */}
          <div>
            <h3 className="font-serif font-bold text-lg mb-4">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex gap-4 pb-4 border-b border-neutral-200 last:border-0"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-20 h-28 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold">{item.title}</h4>
                    <p className="text-neutral-600">
                      Quantity:{" "}
                      <span className="font-semibold">{item.quantity}</span>
                    </p>
                    <p className="text-neutral-600">
                      Price per item:{" "}
                      <span className="font-semibold">
                        ${item.price.toFixed(2)}
                      </span>
                    </p>
                    <p className="text-primary font-bold text-lg mt-2">
                      Subtotal: ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-neutral-50 rounded-xl p-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal ({order.items.length} items):</span>
                <span>${order.totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>Included</span>
              </div>
              <div className="border-t border-neutral-200 pt-3 flex justify-between font-bold text-lg">
                <span>Total Order Price:</span>
                <span className="text-primary">
                  ${order.totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div>
            <h3 className="font-serif font-bold text-lg mb-4">
              Payment Information
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-neutral-600">Payment Status:</span>
                <span
                  className={`font-semibold px-3 py-1 rounded-full text-sm ${
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
                <div className="flex justify-between">
                  <span className="text-neutral-600">Transaction ID:</span>
                  <span className="font-mono text-sm">
                    {order.transactionId}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-200 p-6">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-neutral-100 text-neutral-900 rounded-lg hover:bg-neutral-200 transition-colors font-semibold"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
