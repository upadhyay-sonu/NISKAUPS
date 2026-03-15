require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Validate required environment variables
if (!process.env.GOOGLE_API_KEY) {
  console.error('ERROR: GOOGLE_API_KEY is not defined in .env file');
  process.exit(1);
}

if (!process.env.MONGODB_URI) {
  console.error('ERROR: MONGODB_URI is not defined in .env file');
  process.exit(1);
}

// Connect database
connectDB();

const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

console.log('✅ Allowed CORS Origins:', allowedOrigins);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`⚠️  CORS request from unauthorized origin: ${origin}`);
      callback(null, true); // Allow temporarily for debugging
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP to 300 requests per windowMs
  skip: (req) => req.method === 'GET', // Don't limit GET requests
});

app.use('/api/', limiter);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/blog', require('./routes/blog'));
app.use('/api/books', require('./routes/books'));
app.use('/api/favorites', require('./routes/favorites'));
app.use('/api/news', require('./routes/news'));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`CORS enabled for production and local development`);
  console.log(`API Base URL: http://localhost:${PORT}/api`);
});
