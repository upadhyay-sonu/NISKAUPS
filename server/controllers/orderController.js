const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Activity = require("../models/Activity");

exports.createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product",
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    const items = cart.items.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.salePrice || item.product.price,
      title: item.product.title,
      image: item.product.images[0]?.url,
    }));

    const totalPrice = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const order = new Order({
      user: req.user.id,
      items,
      totalPrice,
      paymentMethod,
      shippingAddress,
      orderStatus: "pending",
    });

    await order.save();

    // Track activity
    await Activity.create({
      user: req.user.id,
      actionType: "order_placed",
      details: { orderId: order._id, totalPrice },
    });

    res.status(201).json({
      success: true,
      message: "Order created",
      order,
    });
  } catch (error) {
    console.error("Error creating order:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.product", "-reviews")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findOne({
      _id: id,
      user: req.user.id,
    }).populate("items.product", "-reviews");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Error fetching order:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
    });
  }
};

exports.updateOrderPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus, transactionId } = req.body;

    const order = await Order.findOne({
      _id: id,
      user: req.user.id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.paymentStatus = paymentStatus;
    if (transactionId) {
      order.transactionId = transactionId;
    }

    if (paymentStatus === "completed") {
      order.orderStatus = "confirmed";

      // Clear cart
      await Cart.findOneAndUpdate(
        { user: req.user.id },
        { items: [], lastUpdated: Date.now() },
      );

      // Track activity
      await Activity.create({
        user: req.user.id,
        actionType: "payment_completed",
        details: { orderId: order._id, transactionId },
      });
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order updated",
      order,
    });
  } catch (error) {
    console.error("Error updating order:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update order",
    });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findOne({
      _id: id,
      user: req.user.id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.paymentStatus === "completed") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel paid order",
      });
    }

    order.orderStatus = "cancelled";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled",
      order,
    });
  } catch (error) {
    console.error("Error cancelling order:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to cancel order",
    });
  }
};
