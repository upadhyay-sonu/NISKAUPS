require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");

const checkBooks = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("\n=== CHECKING ALL BOOKS ===");
    const allBooks = await Product.find({}).countDocuments();
    console.log(`Total books in database: ${allBooks}`);

    console.log("\n=== CHECKING SIGNED BOOKS (category: 'signed') ===");
    const signedBooks = await Product.find({ category: "signed" });
    console.log(`Signed books found: ${signedBooks.length}`);
    signedBooks.forEach((book, idx) => {
      console.log(`${idx + 1}. ${book.title}`);
      console.log(`   Price: $${book.price}`);
      console.log(`   Stock: ${book.stock}`);
      console.log(`   Image: ${book.images[0]?.url ? "✓" : "✗"}`);
      console.log(`   Category: ${book.category}`);
    });

    console.log("\n=== CHECKING FEATURED SIGNED BOOKS ===");
    const featured = await Product.find({ category: "signed", isFeatured: true });
    console.log(`Featured signed books: ${featured.length}`);

    console.log("\n=== CHECKING ALL CATEGORIES ===");
    const categories = await Product.distinct("category");
    console.log("Categories found:", categories);
    for (const cat of categories) {
      const count = await Product.countDocuments({ category: cat });
      console.log(`  ${cat}: ${count} books`);
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error.message);
  }
  process.exit(0);
};

checkBooks();
