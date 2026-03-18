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

// CORS - Apply FIRST, before all other middleware and routes
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  'https://niskaups.vercel.app',
  process.env.FRONTEND_URL, // Support custom frontend URL from env
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
  maxAge: 3600,
}));

console.log('✅ CORS enabled for origins:');
allowedOrigins.forEach(origin => console.log(`   - ${origin}`));

// Middleware
app.use(helmet()); // Security headers
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

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

// Root route - API info
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'NISKAUPS API is running 🚀',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      cart: '/api/cart',
      orders: '/api/orders',
      news: '/api/news',
      books: '/api/books',
      blog: '/api/blog',
      favorites: '/api/favorites',
      health: '/api/health',
      test: '/api/test',
    },
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Test route
app.get('/api/test', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'API working correctly ✅',
    timestamp: new Date().toISOString(),
  });
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
const NODE_ENV = process.env.NODE_ENV || 'development';

const server = app.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log('✅ NISKAUPS API SERVER STARTED');
  console.log('='.repeat(60));
  console.log(`Environment: ${NODE_ENV}`);
  console.log(`Port: ${PORT}`);
  console.log(`URL: http://localhost:${PORT}`);
  console.log(`API Base: http://localhost:${PORT}/api`);
  console.log('='.repeat(60));
  console.log('\n📍 Available Endpoints:');
  console.log(`   GET  /                 - API Info`);
  console.log(`   GET  /api/health       - Health Check`);
  console.log(`   GET  /api/test         - Test Endpoint`);
  console.log(`   GET  /api/products     - Get All Products`);
  console.log(`   GET  /api/products/:id - Get Single Product`);
  console.log('\n');
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received: closing server');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
