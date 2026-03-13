require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");

const generateSlug = (title) => {
  return (
    title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s]+/g, "-")
      .replace(/^-+|-+$/g, "") + `-${Date.now()}`
  );
};

const specialBooks = [
  {
    title: "Collector's Classic Edition",
    author: "Premium Editions",
    slug: generateSlug("Collector's Classic Edition"),
    description:
      "A beautifully designed collector's edition featuring premium binding, exclusive artwork, and archival-quality pages.",
    shortDescription:
      "Beautifully designed collector's edition with premium binding",
    price: 95,
    category: "special",
    images: [
      {
        url: "https://m.media-amazon.com/images/I/81c+cOzzXWL._AC_UF1000,1000_QL80_.jpg",
      },
    ],
    stock: 6,
    sku: `SPECIAL-001-${Date.now()}`,
    publisher: "Premium Editions",
    publicationDate: new Date("2023-06-15"),
    pages: 320,
    isbn: "978-1111111111",
    language: "English",
    isLimitedEdition: true,
    limitedCopies: 100,
    copiesSold: 15,
    isFeatured: true,
    rating: 4.5,
  },
  {
    title: "The Songbird of the Heart – Special Edition",
    author: "Special Editions Press",
    slug: generateSlug("The Songbird of the Heart – Special Edition"),
    description:
      "A limited special edition featuring a stunning illustrated cover and exclusive bonus content for collectors.",
    shortDescription:
      "Limited special edition with illustrated cover and bonus content",
    price: 110,
    category: "special",
    images: [
      {
        url: "https://thegrimoire.co.nz/cdn/shop/files/The_Songbird_of_the_Heart_b67cb5fa-3651-456e-9406-5f7b75aa61cd.png?v=1734781697&width=480",
      },
    ],
    stock: 4,
    sku: `SPECIAL-002-${Date.now()}`,
    publisher: "The Grimoire",
    publicationDate: new Date("2024-01-20"),
    pages: 280,
    isbn: "978-2222222222",
    language: "English",
    isLimitedEdition: true,
    limitedCopies: 75,
    copiesSold: 20,
    isFeatured: true,
    rating: 5,
  },
  {
    title: "Deluxe Literary Edition",
    author: "Deluxe Publishers",
    slug: generateSlug("Deluxe Literary Edition"),
    description:
      "A deluxe hardcover edition created for readers who appreciate elegant book design and collectible releases.",
    shortDescription: "Deluxe hardcover edition with elegant design",
    price: 85,
    category: "special",
    images: [
      {
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTA12QKLPlwCETaMgEUo0HT5QdxK4SrT7XKzw&s",
      },
    ],
    stock: 8,
    sku: `SPECIAL-003-${Date.now()}`,
    publisher: "Deluxe Publishing",
    publicationDate: new Date("2023-08-10"),
    pages: 350,
    isbn: "978-3333333333",
    language: "English",
    isLimitedEdition: true,
    limitedCopies: 120,
    copiesSold: 25,
    isFeatured: true,
    rating: 4.5,
  },
  {
    title: "Premium Collector Library Edition",
    author: "Juniper Books",
    slug: generateSlug("Premium Collector Library Edition"),
    description:
      "A luxury edition designed for collectors featuring premium dust jackets and elegant slipcase packaging.",
    shortDescription: "Luxury edition with premium dust jackets and slipcase",
    price: 140,
    category: "special",
    images: [
      {
        url: "https://juniperbooks.com/cdn/shop/files/bcffd917ad7a350fbda408c6807452f0.jpg?v=1772825253&width=320",
      },
    ],
    stock: 3,
    sku: `SPECIAL-004-${Date.now()}`,
    publisher: "Juniper Books",
    publicationDate: new Date("2024-02-05"),
    pages: 400,
    isbn: "978-4444444444",
    language: "English",
    isLimitedEdition: true,
    limitedCopies: 50,
    copiesSold: 10,
    isFeatured: true,
    rating: 5,
  },
  {
    title: "Limited Author Edition",
    author: "Limited Editions",
    slug: generateSlug("Limited Author Edition"),
    description:
      "A special limited release with exclusive artwork and collector-quality hardcover design.",
    shortDescription: "Limited release with exclusive artwork and hardcover",
    price: 90,
    category: "special",
    images: [
      {
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQN9BT5rcy9WXUV7Elkm8mz3vxbRtJfnpmJxw&s",
      },
    ],
    stock: 7,
    sku: `SPECIAL-005-${Date.now()}`,
    publisher: "Limited Editions",
    publicationDate: new Date("2023-11-15"),
    pages: 300,
    isbn: "978-5555555555",
    language: "English",
    isLimitedEdition: true,
    limitedCopies: 80,
    copiesSold: 18,
    isFeatured: false,
    rating: 4.5,
  },
  {
    title: "Illustrated Deluxe Edition",
    author: "Illustrated Press",
    slug: generateSlug("Illustrated Deluxe Edition"),
    description:
      "A beautifully illustrated edition featuring exclusive artwork and enhanced visual storytelling.",
    shortDescription: "Beautifully illustrated with exclusive artwork",
    price: 120,
    category: "special",
    images: [
      {
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThLdyIAFHBwbOSOh4-4ETCHPcd1mNawpYP_A&s",
      },
    ],
    stock: 5,
    sku: `SPECIAL-006-${Date.now()}`,
    publisher: "Illustrated Press",
    publicationDate: new Date("2024-03-12"),
    pages: 380,
    isbn: "978-6666666666",
    language: "English",
    isLimitedEdition: true,
    limitedCopies: 90,
    copiesSold: 22,
    isFeatured: false,
    rating: 5,
  },
  {
    title: "Premium Special Edition Collection",
    author: "Collector's Press",
    slug: generateSlug("Premium Special Edition Collection"),
    description:
      "A collector's special edition with luxury binding, artistic cover design, and exclusive printing.",
    shortDescription: "Collector edition with luxury binding and artistic design",
    price: 135,
    category: "special",
    images: [
      {
        url: "https://dropinblog.net/cdn-cgi/image/fit=scale-down,format=auto,width=700/34248342/files/featured/special-edition-books-banner.png",
      },
    ],
    stock: 4,
    sku: `SPECIAL-007-${Date.now()}`,
    publisher: "Collector's Press",
    publicationDate: new Date("2023-09-22"),
    pages: 360,
    isbn: "978-7777777777",
    language: "English",
    isLimitedEdition: true,
    limitedCopies: 70,
    copiesSold: 16,
    isFeatured: false,
    rating: 4.5,
  },
  {
    title: "Entangled with Fae – Special Edition",
    author: "Fantasy Editions",
    slug: generateSlug("Entangled with Fae – Special Edition"),
    description:
      "A fantasy special edition featuring a stunning collector cover and premium book design.",
    shortDescription: "Fantasy special edition with stunning collector cover",
    price: 105,
    category: "special",
    images: [
      {
        url: "https://i0.wp.com/maepolzine.com/wp-content/uploads/2025/08/Entangled-with-Fae-Tessonja-Odette-1.jpg",
      },
    ],
    stock: 6,
    sku: `SPECIAL-008-${Date.now()}`,
    publisher: "Fantasy Editions",
    publicationDate: new Date("2024-04-10"),
    pages: 340,
    isbn: "978-8888888888",
    language: "English",
    isLimitedEdition: true,
    limitedCopies: 85,
    copiesSold: 19,
    isFeatured: false,
    rating: 4.5,
  },
  {
    title: "Limited Fantasy Collector Edition",
    author: "Fantasy Collectors",
    slug: generateSlug("Limited Fantasy Collector Edition"),
    description:
      "A beautifully crafted fantasy collector edition designed for passionate readers and collectors.",
    shortDescription: "Beautifully crafted fantasy collector edition",
    price: 98,
    category: "special",
    images: [
      {
        url: "https://i.ytimg.com/vi/Gc4-4dfV3Lc/hq720.jpg",
      },
    ],
    stock: 7,
    sku: `SPECIAL-009-${Date.now()}`,
    publisher: "Fantasy Collectors",
    publicationDate: new Date("2023-12-08"),
    pages: 370,
    isbn: "978-9999999999",
    language: "English",
    isLimitedEdition: true,
    limitedCopies: 95,
    copiesSold: 21,
    isFeatured: false,
    rating: 5,
  },
  {
    title: "The Love Hypothesis – Special Edition",
    author: "Romance Publishing",
    slug: generateSlug("The Love Hypothesis – Special Edition"),
    description:
      "A collectible edition of the popular romance novel with an exclusive premium cover design.",
    shortDescription: "Collectible romance edition with premium cover design",
    price: 80,
    category: "special",
    images: [
      {
        url: "https://people.com/thmb/Cc4fVtSbGiVHYIumBNi3DQmg76I=/4000x0/filters:no_upscale():max_bytes(150000):strip_icc():focal(539x0:541x2)/the-love-hypothesis-123124-11b6689a8c604310b284c349c48c5253.jpg",
      },
    ],
    stock: 9,
    sku: `SPECIAL-010-${Date.now()}`,
    publisher: "Romance Publishing",
    publicationDate: new Date("2024-01-15"),
    pages: 310,
    isbn: "978-1010101010",
    language: "English",
    isLimitedEdition: true,
    limitedCopies: 110,
    copiesSold: 28,
    isFeatured: true,
    rating: 5,
  },
  {
    title: "Harry Potter Film Vault – Collector Edition",
    author: "Warner Bros",
    slug: generateSlug("Harry Potter Film Vault – Collector Edition"),
    description:
      "A premium collector edition featuring behind-the-scenes content and exclusive artwork from the Harry Potter films.",
    shortDescription:
      "Premium collector edition with behind-the-scenes content",
    price: 150,
    category: "special",
    images: [
      {
        url: "https://images-cdn.ubuy.co.in/651a47ba107fd009ed3c36e2-harry-potter-film-vault-the-complete.jpg",
      },
    ],
    stock: 2,
    sku: `SPECIAL-011-${Date.now()}`,
    publisher: "Warner Bros",
    publicationDate: new Date("2023-10-20"),
    pages: 420,
    isbn: "978-1111010101",
    language: "English",
    isLimitedEdition: true,
    limitedCopies: 40,
    copiesSold: 8,
    isFeatured: true,
    rating: 5,
  },
  {
    title: "Signature Fantasy Special Edition",
    author: "Fantasy Signature",
    slug: generateSlug("Signature Fantasy Special Edition"),
    description:
      "A beautifully designed fantasy collector book with premium hardcover and exclusive artwork.",
    shortDescription: "Fantasy collector book with premium hardcover design",
    price: 115,
    category: "special",
    images: [
      {
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTON2MbXu9rGpfph_aaHMM8ln0buP5uUks1YQ&s",
      },
    ],
    stock: 5,
    sku: `SPECIAL-012-${Date.now()}`,
    publisher: "Fantasy Signature",
    publicationDate: new Date("2023-07-18"),
    pages: 390,
    isbn: "978-1212121212",
    language: "English",
    isLimitedEdition: true,
    limitedCopies: 88,
    copiesSold: 17,
    isFeatured: false,
    rating: 4.5,
  },
  {
    title: "Collector's Gold Edition",
    author: "Gold Editions",
    slug: generateSlug("Collector's Gold Edition"),
    description:
      "A luxurious collector edition with premium printing and exclusive limited release packaging.",
    shortDescription: "Luxurious collector edition with premium printing",
    price: 130,
    category: "special",
    images: [
      {
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPyZ-aw9pF4NSOz_b9ijUikBVdCOmP3KKGcw&s",
      },
    ],
    stock: 4,
    sku: `SPECIAL-013-${Date.now()}`,
    publisher: "Gold Editions",
    publicationDate: new Date("2024-02-28"),
    pages: 370,
    isbn: "978-1313131313",
    language: "English",
    isLimitedEdition: true,
    limitedCopies: 65,
    copiesSold: 14,
    isFeatured: false,
    rating: 5,
  },
];

const addSpecialBooks = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");

    console.log("Adding special edition books...");
    const insertedBooks = await Product.insertMany(specialBooks, {
      ordered: false,
    });

    console.log(`✓ Successfully added ${insertedBooks.length} special edition books`);
    insertedBooks.forEach((book) => {
      console.log(`  - ${book.title} ($${book.price})`);
    });

    await mongoose.disconnect();
    console.log("MongoDB disconnected");
    process.exit(0);
  } catch (error) {
    console.error("Failed to add special books:", error.message);
    process.exit(1);
  }
};

addSpecialBooks();
