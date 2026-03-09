const express = require("express");
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderPayment,
  cancelOrder,
} = require("../controllers/orderController");
const { protect } = require("../middleware/auth");

router.use(protect);

router.post("/", createOrder);
router.get("/", getUserOrders);
router.get("/:id", getOrderById);
router.put("/:id/payment", updateOrderPayment);
router.put("/:id/cancel", cancelOrder);

module.exports = router;
