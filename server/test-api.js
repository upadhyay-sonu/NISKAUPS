require("dotenv").config();
const axios = require("axios");

const testAPI = async () => {
  try {
    console.log("Testing API endpoint: GET /api/products?category=signed");
    const response = await axios.get("http://localhost:5000/api/products", {
      params: {
        category: "signed",
      },
    });

    console.log("\nAPI Response:");
    console.log("Status:", response.status);
    console.log("Books returned:", response.data.products.length);
    console.log("Total in database:", response.data.total);
    console.log("Current page:", response.data.currentPage);
    console.log("Pages:", response.data.pages);

    console.log("\nBooks:");
    response.data.products.forEach((book, idx) => {
      console.log(`${idx + 1}. ${book.title}`);
      console.log(`   Price: $${book.price}`);
      console.log(`   Image URL: ${book.images[0]?.url?.substring(0, 80)}`);
    });
  } catch (error) {
    console.error(
      "Error:",
      error.response?.data || error.message
    );
  }
  process.exit(0);
};

// Wait for server to be ready
setTimeout(testAPI, 2000);
