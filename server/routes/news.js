const express = require("express");
const router = express.Router();
const {
  getTopNews,
  getBookNews,
  getTrendingNews,
  searchNews,
} = require("../controllers/newsController");

// Public routes
router.get("/top", getTopNews);
router.get("/books", getBookNews);
router.get("/trending", getTrendingNews);
router.get("/search", searchNews);

module.exports = router;
