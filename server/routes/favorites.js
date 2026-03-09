const express = require("express");
const router = express.Router();
const {
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  isFavorite,
} = require("../controllers/favoritesController");
const { protect } = require("../middleware/auth");

router.use(protect);

router.get("/", getFavorites);
router.post("/add/:productId", addToFavorites);
router.delete("/remove/:productId", removeFromFavorites);
router.get("/check/:productId", isFavorite);

module.exports = router;
