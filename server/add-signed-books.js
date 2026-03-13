require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s]+/g, "-")
    .replace(/^-+|-+$/g, "") + `-${Date.now()}`;
};

const signedBooks = [
  {
    title: "The Great Gatsby (Signed Edition)",
    author: "F. Scott Fitzgerald",
    slug: generateSlug("The Great Gatsby (Signed Edition)"),
    description:
      "A rare signed edition of F. Scott Fitzgerald's classic novel exploring wealth, love, and the American dream in the roaring twenties.",
    shortDescription:
      "Rare signed edition of Fitzgerald's classic exploring wealth and love",
    price: 120,
    category: "signed",
    images: [
      {
        url: "https://juniperbooks.com/cdn/shop/files/9f1ae73c-1682-40aa-812c-e256b1d3d0f4.jpg?v=1770073001&width=320",
      },
    ],
    stock: 5,
    sku: `SIGNED-001-${Date.now()}`,
    publisher: "Scribner",
    publicationDate: new Date("1925-04-10"),
    pages: 180,
    isbn: "978-0743273565",
    language: "English",
    isLimitedEdition: true,
    limitedCopies: 50,
    copiesSold: 12,
    isFeatured: true,
    rating: 5,
  },
  {
    title: "A Farewell to Arms (Signed by Ernest Hemingway)",
    author: "Ernest Hemingway",
    slug: generateSlug("A Farewell to Arms (Signed by Ernest Hemingway)"),
    description:
      "A collectible signed edition of Hemingway's famous war novel about love and tragedy during World War I.",
    shortDescription:
      "Collectible signed war novel about love and tragedy in WWI",
    price: 180,
    category: "signed",
    images: [
      {
        url: "https://natedsandersauctionblog.com/wp-content/uploads/2019/07/Ernest-Hemingway-Signed-Farewell-to-Arms53741_lg.jpeg",
      },
    ],
    stock: 3,
    sku: `SIGNED-002-${Date.now()}`,
    publisher: "Charles Scribner's Sons",
    publicationDate: new Date("1929-09-27"),
    pages: 355,
    isbn: "978-0684801469",
    language: "English",
    isLimitedEdition: true,
    limitedCopies: 30,
    copiesSold: 8,
    isFeatured: true,
    rating: 5,
  },
  {
    title: "Special Signed Collector Edition",
    author: "Various Authors",
    slug: generateSlug("Special Signed Collector Edition"),
    description:
      "A limited signed collector's edition with premium cover design and exclusive author signature.",
    shortDescription: "Limited signed collector's edition with premium design",
    price: 95,
    category: "signed",
    images: [
      {
        url: "https://scribblesbookshop.com/cdn/shop/files/Cover_Options_Preorders_2_b4bf2851-96fe-4687-869c-e957913d528d.png?v=1771429683&width=533",
      },
    ],
    stock: 7,
    sku: `SIGNED-003-${Date.now()}`,
    publisher: "Premium Editions",
    publicationDate: new Date("2024-01-15"),
    pages: 320,
    isbn: "978-1234567890",
    language: "English",
    isLimitedEdition: true,
    limitedCopies: 100,
    copiesSold: 25,
    isFeatured: true,
    rating: 4.5,
  },
  {
    title: "Classic Author Signed Book",
    author: "Classic Author",
    slug: generateSlug("Classic Author Signed Book"),
    description:
      "A beautifully preserved signed copy of a classic novel loved by readers worldwide.",
    shortDescription: "Beautifully preserved signed classic novel",
    price: 110,
    category: "signed",
    images: [
      {
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSn6L0JEqx4KXESSLRIjr47edo9zoZC7AJAgw&s",
      },
    ],
    stock: 6,
    sku: `SIGNED-004-${Date.now()}`,
    publisher: "Classic Publishers",
    publicationDate: new Date("1950-05-20"),
    pages: 288,
    isbn: "978-0987654321",
    language: "English",
    isLimitedEdition: true,
    limitedCopies: 75,
    copiesSold: 18,
    isFeatured: false,
    rating: 4.5,
  },
  {
    title: "Vintage Signed Literary Classic",
    author: "Vintage Author",
    slug: generateSlug("Vintage Signed Literary Classic"),
    description:
      "A vintage signed book featuring an authentic author signature and collectible cover.",
    shortDescription: "Vintage signed book with authentic author signature",
    price: 140,
    category: "signed",
    images: [
      {
        url: "https://i.ebayimg.com/images/g/hwIAAeSwAwBpemVt/s-l1200.webp",
      },
    ],
    stock: 4,
    sku: `SIGNED-005-${Date.now()}`,
    publisher: "Vintage Classics",
    publicationDate: new Date("1960-03-10"),
    pages: 400,
    isbn: "978-1111111111",
    language: "English",
    isLimitedEdition: true,
    limitedCopies: 60,
    copiesSold: 15,
    isFeatured: false,
    rating: 5,
  },
  {
    title: "Limited Signed Edition Novel",
    author: "Edition Author",
    slug: generateSlug("Limited Signed Edition Novel"),
    description:
      "A rare limited edition signed novel for collectors and literature enthusiasts.",
    shortDescription: "Rare limited edition signed novel for collectors",
    price: 160,
    category: "signed",
    images: [
      {
        url: "https://i.ebayimg.com/00/s/MTYwMFgxMjg0/z/AR0AAOSwFTxkMFgH/$_12.JPG",
      },
    ],
    stock: 2,
    sku: `SIGNED-006-${Date.now()}`,
    publisher: "Limited Editions Press",
    publicationDate: new Date("1970-07-15"),
    pages: 350,
    isbn: "978-2222222222",
    language: "English",
    isLimitedEdition: true,
    limitedCopies: 40,
    copiesSold: 10,
    isFeatured: false,
    rating: 4.5,
  },
  {
    title: "Games of My Life (Signed Edition)",
    author: "Life Author",
    slug: generateSlug("Games of My Life (Signed Edition)"),
    description:
      "A signed memoir sharing inspiring life stories, memorable moments, and personal experiences from the author.",
    shortDescription:
      "Signed memoir with inspiring stories and personal experiences",
    price: 85,
    category: "signed",
    images: [
      {
        url: "https://www.bookabookshop.co.uk/wp-content/uploads/2026/03/Games-of-My-Life-jacket-333x444.jpg",
      },
    ],
    stock: 8,
    sku: `SIGNED-007-${Date.now()}`,
    publisher: "Memoir Press",
    publicationDate: new Date("2020-09-22"),
    pages: 280,
    isbn: "978-3333333333",
    language: "English",
    isLimitedEdition: true,
    limitedCopies: 150,
    copiesSold: 35,
    isFeatured: true,
    rating: 4.5,
  },
];

const addSignedBooks = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");

    console.log("Adding signed books...");
    const insertedBooks = await Product.insertMany(signedBooks, {
      ordered: false,
    });

    console.log(`✓ Successfully added ${insertedBooks.length} signed books`);
    insertedBooks.forEach((book) => {
      console.log(`  - ${book.title} ($${book.price})`);
    });

    await mongoose.disconnect();
    console.log("MongoDB disconnected");
    process.exit(0);
  } catch (error) {
    console.error("Failed to add signed books:", error.message);
    process.exit(1);
  }
};

addSignedBooks();
