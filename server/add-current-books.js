require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");

const booksToAdd = [
  {
    title: "The Seven Year Slip",
    slug: `the-seven-year-slip-${Date.now()}`,
    author: "Ashley Poston",
    description:
      "A captivating romance novel about love, second chances, and timeless connections across seven years.",
    shortDescription: "A captivating romance about second chances",
    price: 18.99,
    salePrice: null,
    category: "current",
    images: [
      {
        url: "https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1692812800-81lyuR-n1-L.jpg?crop=1xw:0.993xh;center,top&resize=980:*",
      },
    ],
    stock: 15,
    sku: `CURRENT-7YS-${Date.now()}-1`,
    publisher: "St. Martin's Press",
    publicationDate: new Date("2023-06-01"),
    pages: 352,
    language: "English",
    isFeatured: true,
    rating: 4.5,
  },
  {
    title: "One Last Time",
    slug: `one-last-time-${Date.now()}`,
    author: "Kasie West",
    description:
      "An emotional and heartwarming story about love, loss, and new beginnings in the face of adversity.",
    shortDescription: "A story about love, loss, and new beginnings",
    price: 17.99,
    salePrice: null,
    category: "current",
    images: [
      {
        url: "https://m.media-amazon.com/images/I/71xhK78NozL._UF1000,1000_QL80_.jpg",
      },
    ],
    stock: 12,
    sku: `CURRENT-OLT-${Date.now()}-2`,
    publisher: "Scholastic Press",
    publicationDate: new Date("2023-04-01"),
    pages: 320,
    language: "English",
    isFeatured: true,
    rating: 4.3,
  },
  {
    title: "Finding Jenny Kelly",
    slug: `finding-jenny-kelly-${Date.now()}`,
    author: "Sara Daviss",
    description:
      "A gripping contemporary fiction novel about self-discovery, redemption, and finding your true path.",
    shortDescription: "A novel about self-discovery and redemption",
    price: 16.99,
    salePrice: null,
    category: "current",
    images: [
      {
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQn8AprnHW30WOIwqjmqnZzWLC2Qvc-WP29hw&s",
      },
    ],
    stock: 10,
    sku: `CURRENT-FJK-${Date.now()}-3`,
    publisher: "Hachette Book Group",
    publicationDate: new Date("2023-05-01"),
    pages: 304,
    language: "English",
    isFeatured: true,
    rating: 4.4,
  },
  {
    title: "The Wedding Crasher",
    slug: `the-wedding-crasher-${Date.now()}`,
    author: "Jane Costello",
    description:
      "A charming romantic comedy about unexpected connections, serendipity, and love at first sight.",
    shortDescription: "A romantic comedy about unexpected connections",
    price: 19.99,
    salePrice: null,
    category: "current",
    images: [
      {
        url: "https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1642006901-41twCm1DBNL._SL500_.jpg?crop=1xw:0.996xh;center,top&resize=980:*",
      },
    ],
    stock: 14,
    sku: `CURRENT-WC-${Date.now()}-4`,
    publisher: "Penguin Books",
    publicationDate: new Date("2023-03-01"),
    pages: 336,
    language: "English",
    isFeatured: true,
    rating: 4.6,
  },
];

const addBooks = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✓ MongoDB connected");

    console.log(`\nInserting ${booksToAdd.length} current selection books...`);
    const result = await Product.insertMany(booksToAdd, { ordered: false });

    console.log("\n✓ Books added successfully!");
    console.log(`✓ Total books inserted: ${result.length}`);
    result.forEach((book) => {
      console.log(`  - ${book.title} ($${book.price})`);
    });

    console.log("\n✓ These books are now available in /books/current");

    await mongoose.disconnect();
    console.log("✓ MongoDB disconnected\n");
    process.exit(0);
  } catch (error) {
    console.error("Error adding books:", error.message);
    process.exit(1);
  }
};

addBooks();
