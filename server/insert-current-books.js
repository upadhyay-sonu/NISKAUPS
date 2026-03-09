require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");

const currentBooks = [
  {
    title: "The Seven Year Slip",
    author: "Ashley Poston",
    description:
      "A captivating romance novel about second chances and timeless love.",
    shortDescription: "A captivating romance about second chances",
    price: 18,
    salePrice: null,
    category: "current",
    images: [
      {
        url: "https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1692812800-81lyuR-n1-L.jpg?crop=1xw:0.993xh;center,top&resize=980:*",
      },
    ],
    stock: 15,
    sku: `SKU-CURRENT-001-${Date.now()}`,
    publisher: "St. Martin's Press",
    publicationDate: new Date("2023-06-01"),
    pages: 352,
    language: "English",
    isFeatured: true,
    rating: 4.5,
  },
  {
    title: "One Last Time",
    author: "Kasie West",
    description:
      "An emotional and heartwarming story about love, loss, and new beginnings.",
    shortDescription: "A story about love, loss, and new beginnings",
    price: 17,
    salePrice: null,
    category: "current",
    images: [
      {
        url: "https://m.media-amazon.com/images/I/71xhK78NozL._UF1000,1000_QL80_.jpg",
      },
    ],
    stock: 12,
    sku: `SKU-CURRENT-002-${Date.now()}`,
    publisher: "Scholastic Press",
    publicationDate: new Date("2023-04-01"),
    pages: 320,
    language: "English",
    isFeatured: true,
    rating: 4.3,
  },
  {
    title: "Finding Jenny Kelly",
    author: "Sara Daviss",
    description:
      "A gripping contemporary fiction novel about self-discovery and redemption.",
    shortDescription: "A novel about self-discovery and redemption",
    price: 16,
    salePrice: null,
    category: "current",
    images: [
      {
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQn8AprnHW30WOIwqjmqnZzWLC2Qvc-WP29hw&s",
      },
    ],
    stock: 10,
    sku: `SKU-CURRENT-003-${Date.now()}`,
    publisher: "Hachette Book Group",
    publicationDate: new Date("2023-05-01"),
    pages: 304,
    language: "English",
    isFeatured: true,
    rating: 4.4,
  },
  {
    title: "The Wedding Crasher",
    author: "Jane Costello",
    description:
      "A charming romantic comedy about unexpected connections and love at first sight.",
    shortDescription: "A romantic comedy about unexpected connections",
    price: 19,
    salePrice: null,
    category: "current",
    images: [
      {
        url: "https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1642006901-41twCm1DBNL._SL500_.jpg?crop=1xw:0.996xh;center,top&resize=980:*",
      },
    ],
    stock: 14,
    sku: `SKU-CURRENT-004-${Date.now()}`,
    publisher: "Penguin Books",
    publicationDate: new Date("2023-03-01"),
    pages: 336,
    language: "English",
    isFeatured: true,
    rating: 4.6,
  },
];

const insertBooks = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");

    console.log("Inserting current selection books...");
    const insertedBooks = await Product.insertMany(currentBooks, {
      ordered: false,
    });

    console.log("Books added successfully");
    console.log(`✓ Total books inserted: ${insertedBooks.length}`);
    insertedBooks.forEach((book) => {
      console.log(`  - ${book.title} (${book.sku})`);
    });

    await mongoose.disconnect();
    console.log("MongoDB disconnected");
    process.exit(0);
  } catch (error) {
    console.error("Error inserting books:", error.message);
    process.exit(1);
  }
};

insertBooks();
