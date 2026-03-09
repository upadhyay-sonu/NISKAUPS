import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CreditCard, Smartphone, Building2 } from "lucide-react";
import api from "../config/api";

const Payment = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("card");
  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      setOrder(response.data?.order);
    } catch (error) {
      console.error("Failed to fetch order:", error);
      navigate("/cart");
    } finally {
      setLoading(false);
    }
  };

  const validatePayment = () => {
    if (activeTab === "card") {
      if (!cardData.cardNumber || !cardData.cardHolder || !cardData.expiryDate || !cardData.cvv) {
        alert("Please fill in all card details");
        return false;
      }
      if (cardData.cardNumber.length < 13) {
        alert("Invalid card number");
        return false;
      }
    }
    return true;
  };

  const handlePayment = async () => {
    if (!validatePayment()) return;

    setPaymentLoading(true);
    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Update order with payment confirmation
      await api.put(`/orders/${orderId}/payment`, {
        paymentStatus: "completed",
        transactionId: `TXN-${Date.now()}`,
      });

      // Redirect to order confirmation
      navigate(`/order-confirmation/${orderId}`);
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "cardNumber") {
      formattedValue = value.replace(/\s/g, "").slice(0, 16);
      formattedValue = formattedValue.replace(/(\d{4})/g, "$1 ").trim();
    } else if (name === "expiryDate") {
      formattedValue = value.replace(/\D/g, "").slice(0, 4);
      if (formattedValue.length >= 2) {
        formattedValue = `${formattedValue.slice(0, 2)}/${formattedValue.slice(2)}`;
      }
    } else if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "").slice(0, 3);
    }

    setCardData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
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
      <h1 className="text-4xl font-serif font-bold mb-12">Complete Payment</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Form */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-neutral-200 rounded-2xl p-6"
          >
            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b border-neutral-200">
              {[
                { id: "card", label: "Card", icon: CreditCard },
                { id: "upi", label: "UPI", icon: Smartphone },
                { id: "net_banking", label: "Net Banking", icon: Building2 },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 transition ${
                    activeTab === id
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <Icon size={20} />
                  {label}
                </button>
              ))}
            </div>

            {/* Card Payment Form */}
            {activeTab === "card" && (
              <div className="space-y-4">
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="Card Number"
                  value={cardData.cardNumber}
                  onChange={handleCardInputChange}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary"
                />
                <input
                  type="text"
                  name="cardHolder"
                  placeholder="Card Holder Name"
                  value={cardData.cardHolder}
                  onChange={handleCardInputChange}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="expiryDate"
                    placeholder="MM/YY"
                    value={cardData.expiryDate}
                    onChange={handleCardInputChange}
                    className="px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary"
                  />
                  <input
                    type="text"
                    name="cvv"
                    placeholder="CVV"
                    value={cardData.cvv}
                    onChange={handleCardInputChange}
                    maxLength="3"
                    className="px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            )}

            {/* UPI */}
            {activeTab === "upi" && (
              <input
                type="text"
                placeholder="Enter UPI ID (e.g., username@bank)"
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary"
              />
            )}

            {/* Net Banking */}
            {activeTab === "net_banking" && (
              <select className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary">
                <option>Select Bank</option>
                <option>HDFC Bank</option>
                <option>ICICI Bank</option>
                <option>SBI</option>
                <option>Axis Bank</option>
              </select>
            )}
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
              {order.items.map((item) => (
                <div key={item.product} className="flex justify-between">
                  <span className="text-sm text-gray-600 line-clamp-1">
                    {item.title} x {item.quantity}
                  </span>
                  <span className="font-semibold text-sm">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between mb-6 pb-6 border-b border-neutral-200">
              <span className="font-serif font-bold">Total Amount</span>
              <span className="font-serif font-bold text-primary text-lg">
                ${order.totalPrice.toFixed(2)}
              </span>
            </div>

            <button
              onClick={handlePayment}
              disabled={paymentLoading}
              className={`w-full px-4 py-3 bg-primary text-white font-medium rounded-lg transition ${
                paymentLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-primary-dark"
              }`}
            >
              {paymentLoading ? "Processing..." : "Pay Now"}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
