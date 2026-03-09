require("dotenv").config();
const mongoose = require("mongoose");
const axios = require("axios");
const Product = require("./models/Product");

// Validate required environment variables
if (!process.env.GOOGLE_API_KEY) {
  console.error("ERROR: GOOGLE_API_KEY is not defined in .env file");
  process.exit(1);
}

if (!process.env.MONGODB_URI) {
  console.error("ERROR: MONGODB_URI is not defined in .env file");
  process.exit(1);
}

const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes";

const seedDatabase = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");

    console.log("Deleting existing products...");
    const deleteResult = await Product.deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} existing products`);

    const apiKey = process.env.GOOGLE_API_KEY;

    console.log("Fetching books from Google Books API...");
    const response = await axios.get(GOOGLE_BOOKS_API, {
      params: {
        q: "subject:photography OR subject:art OR subject:design",
        maxResults: 40,
        key: apiKey,
      },
      timeout: 15000,
    });

    if (!response.data.items || response.data.items.length === 0) {
      throw new Error("No books found from Google Books API");
    }

    console.log(`Received ${response.data.items.length} books from API`);

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
      throw new Error("No valid books with thumbnails found");
    }

    console.log(`Filtered to ${validBooks.length} valid books with thumbnails`);

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

    console.log(`Inserting ${booksToInsert.length} products into database...`);
    const insertedProducts = await Product.insertMany(booksToInsert, {
      ordered: false,
    });

    console.log("Database seeded successfully");
    console.log(`✓ Total products inserted: ${insertedProducts.length}`);
    console.log(
      `✓ Featured products: ${insertedProducts.filter((p) => p.isFeatured).length}`,
    );

    await mongoose.disconnect();
    console.log("MongoDB disconnected");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seedDatabase();
