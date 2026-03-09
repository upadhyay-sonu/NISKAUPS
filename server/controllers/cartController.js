const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Activity = require("../models/Activity");

exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product",
      "-reviews",
    );

    if (!cart) {
      return res.status(200).json({
        success: true,
        items: [],
        total: 0,
        count: 0,
      });
    }

    const total = cart.items.reduce((sum, item) => {
      const price = item.product.salePrice || item.product.price;
      return sum + price * item.quantity;
    }, 0);

    res.status(200).json({
      success: true,
      items: cart.items,
      total: total.toFixed(2),
      count: cart.items.length,
    });
  } catch (error) {
    console.error("Error fetching cart:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch cart",
    });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { product: productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = new Cart({
        user: req.user.id,
        items: [{ product: productId, quantity }],
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.product.toString() === productId,
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
    }

    cart.lastUpdated = Date.now();
    await cart.save();

    // Track activity
    await Activity.create({
      user: req.user.id,
      actionType: "add_to_cart",
      product: productId,
      details: { quantity },
    });

    res.status(201).json({
      success: true,
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    console.error("Error adding to cart:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to add product to cart",
    });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be greater than 0",
      });
    }

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (item) => item.product.toString() === productId,
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Product not in cart",
      });
    }

    item.quantity = quantity;
    cart.lastUpdated = Date.now();
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart item updated",
      cart,
    });
  } catch (error) {
    console.error("Error updating cart:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update cart item",
    });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId,
    );

    cart.lastUpdated = Date.now();
    await cart.save();

    // Track activity
    await Activity.create({
      user: req.user.id,
      actionType: "remove_from_cart",
      product: productId,
    });

    res.status(200).json({
      success: true,
      message: "Product removed from cart",
      count: cart.items.length,
    });
  } catch (error) {
    console.error("Error removing from cart:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to remove product from cart",
    });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = [];
    cart.lastUpdated = Date.now();
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart cleared",
    });
  } catch (error) {
    console.error("Error clearing cart:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to clear cart",
    });
  }
};
