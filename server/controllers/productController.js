const Product = require("../models/Product");
const axios = require("axios");

const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes";

const populateProductsFromAPI = async () => {
  try {
    console.log("Database is empty. Fetching books from Google Books API...");

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      console.error("GOOGLE_API_KEY not configured");
      return [];
    }

    const response = await axios.get(GOOGLE_BOOKS_API, {
      params: {
        q: "subject:photography OR subject:art OR subject:design",
        maxResults: 40,
        key: apiKey,
      },
      timeout: 10000,
    });

    if (!response.data.items || response.data.items.length === 0) {
      console.warn("No books found from Google Books API");
      return [];
    }

    const categories = ["current", "signed", "special"];
    const validBooks = response.data.items.filter((item) => {
      const vol = item.volumeInfo || {};
      return (
        vol.imageLinks?.thumbnail &&
        vol.title &&
        vol.authors &&
        vol.authors.length > 0
      );
    });

    if (validBooks.length === 0) {
      console.warn("No valid books with thumbnails found");
      return [];
    }

    const booksToInsert = validBooks.slice(0, 20).map((book, index) => {
      const vol = book.volumeInfo || {};
      const basePrice = Math.floor(Math.random() * (80 - 20 + 1)) + 20;
      const isFeatured = index < 6;
      const category = categories[index % categories.length];

      return {
        title: vol.title,
        author: vol.authors[0],
        description: vol.description || "Premium quality book",
        shortDescription:
          vol.description?.substring(0, 150) || "Premium edition",
        price: basePrice,
        salePrice: null,
        category: category,
        images: [
          {
            url: vol.imageLinks.thumbnail.replace(/http:/, "https:"),
          },
        ],
        stock: Math.floor(Math.random() * (20 - 5 + 1)) + 5,
        sku: `SKU-${Date.now()}-${index}`,
        publisher: vol.publisher || "Publisher",
        publicationDate: vol.publishedDate
          ? new Date(vol.publishedDate)
          : new Date(),
        pages: vol.pageCount || 256,
        isbn: vol.industryIdentifiers?.[0]?.identifier || null,
        language: "English",
        isLimitedEdition: Math.random() > 0.75,
        limitedCopies:
          Math.random() > 0.75 ? Math.floor(Math.random() * 100) + 50 : null,
        isFeatured: isFeatured,
        rating: Math.floor(Math.random() * 2) + 4,
      };
    });

    if (booksToInsert.length > 0) {
      console.log(`Inserting ${booksToInsert.length} books into database...`);
      await Product.insertMany(booksToInsert, { ordered: false });
      console.log("Successfully populated database with books");
    }

    return booksToInsert;
  } catch (error) {
    console.error("Error populating products from API:", error.message);
    return [];
  }
};

exports.getProducts = async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      author,
      sort,
      page = 1,
      limit = 12,
      search,
    } = req.query;

    const existingProducts = await Product.countDocuments();

    if (existingProducts === 0) {
      await populateProductsFromAPI();
    }

    let filter = {};

    if (category) {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (author) {
      filter.author = { $regex: author, $options: "i" };
    }

    if (search) {
      filter.$text = { $search: search };
    }

    let sortObj = {};
    if (sort === "price-low") {
      sortObj.price = 1;
    } else if (sort === "price-high") {
      sortObj.price = -1;
    } else if (sort === "newest") {
      sortObj.createdAt = -1;
    } else if (sort === "best-selling") {
      sortObj.copiesSold = -1;
    } else {
      sortObj.createdAt = -1;
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum)
      .select("-reviews");

    res.status(200).json({
      success: true,
      products,
      total,
      count: products.length,
      pages: Math.ceil(total / limitNum),
      currentPage: pageNum,
    });
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({
      $or: [{ _id: id }, { slug: id }],
    }).populate("reviews.user", "name");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error fetching product:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
    });
  }
};

exports.getFeaturedProducts = async (req, res) => {
  try {
    console.log("Fetching featured products...");

    const products = await Product.find({ isFeatured: true })
      .limit(8)
      .select("-reviews");

    console.log(`Found ${products.length} featured products`);

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Error fetching featured products:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch featured products",
    });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user.id,
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "Product already reviewed by you",
      });
    }

    product.reviews.push({
      user: req.user.id,
      rating,
      comment,
    });

    const avgRating =
      product.reviews.reduce((sum, r) => sum + r.rating, 0) /
      product.reviews.length;

    product.rating = avgRating;
    product.totalReviews = product.reviews.length;

    await product.save();

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
