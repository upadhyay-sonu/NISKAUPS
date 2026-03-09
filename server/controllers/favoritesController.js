const Favorites = require("../models/Favorites");
const Product = require("../models/Product");

exports.getFavorites = async (req, res) => {
    try {
        const favorites = await Favorites.findOne({ user: req.user.id }).populate(
            "products.product",
            "-reviews",
        );

        if (!favorites) {
            return res.status(200).json({
                success: true,
                products: [],
                count: 0,
            });
        }

        res.status(200).json({
            success: true,
            products: favorites.products.map((item) => item.product),
            count: favorites.products.length,
        });
    } catch (error) {
        console.error("Error fetching favorites:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to fetch favorites",
        });
    }
};

exports.addToFavorites = async (req, res) => {
    try {
        const { productId } = req.params;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        let favorites = await Favorites.findOne({ user: req.user.id });

        if (!favorites) {
            favorites = new Favorites({
                user: req.user.id,
                products: [{ product: productId }],
            });
        } else {
            const productExists = favorites.products.some(
                (item) => item.product.toString() === productId,
            );

            if (productExists) {
                return res.status(400).json({
                    success: false,
                    message: "Product already in favorites",
                });
            }

            favorites.products.push({ product: productId });
        }

        favorites.lastUpdated = Date.now();
        await favorites.save();

        res.status(201).json({
            success: true,
            message: "Product added to favorites",
            favorites,
        });
    } catch (error) {
        console.error("Error adding to favorites:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to add product to favorites",
        });
    }
};

exports.removeFromFavorites = async (req, res) => {
    try {
        const { productId } = req.params;

        const favorites = await Favorites.findOne({ user: req.user.id });

        if (!favorites) {
            return res.status(404).json({
                success: false,
                message: "Favorites list not found",
            });
        }

        favorites.products = favorites.products.filter(
            (item) => item.product.toString() !== productId,
        );

        favorites.lastUpdated = Date.now();
        await favorites.save();

        res.status(200).json({
            success: true,
            message: "Product removed from favorites",
            count: favorites.products.length,
        });
    } catch (error) {
        console.error("Error removing from favorites:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to remove product from favorites",
        });
    }
};

exports.isFavorite = async (req, res) => {
    try {
        const { productId } = req.params;

        const favorites = await Favorites.findOne({
            user: req.user.id,
            "products.product": productId,
        });

        res.status(200).json({
            success: true,
            isFavorite: !!favorites,
        });
    } catch (error) {
        console.error("Error checking favorite status:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to check favorite status",
        });
    }
};
