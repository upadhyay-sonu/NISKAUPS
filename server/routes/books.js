const express = require('express');
const { getBooks } = require('../controllers/booksController');

const router = express.Router();

/**
 * GET /api/books
 * Fetch curated books from Google Books API
 * Query: photography, art, design
 * Returns: Normalized book data with thumbnails
 */
router.get('/', getBooks);

module.exports = router;
