const express = require("express");
const router = express.Router();
const {
  getTopNews,
  getBookNews,
  getTrendingNews,
  searchNews,
} = require("../controllers/newsController");

// Public routes
// Updated endpoint names as per specification
router.get("/headlines", getTopNews); // Top Headlines
router.get("/books", getBookNews); // Book News
router.get("/trending", getTrendingNews); // Trending
router.get("/search", searchNews);

// Keep old endpoints for backward compatibility
router.get("/top", getTopNews);

module.exports = router;
