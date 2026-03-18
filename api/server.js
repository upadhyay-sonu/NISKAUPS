require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const serverless = require('serverless-http');
const connectDB = require('../server/config/database');
const errorHandler = require('../server/middleware/errorHandler');

// Validate required environment variables
if (!process.env.GOOGLE_API_KEY) {
  console.error('ERROR: GOOGLE_API_KEY is not defined in .env file');
  // Don't exit in serverless environment
}

if (!process.env.MONGODB_URI) {
  console.error('ERROR: MONGODB_URI is not defined in .env file');
  // Don't exit in serverless environment
}

// Connect database
try {
  connectDB();
  console.log('✅ Database connected in serverless');
} catch (error) {
  console.error('Database connection error:', error.message);
}

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

// Rate limiting - more lenient for serverless
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // limit each IP to 500 requests per windowMs (increased for serverless)
  skip: (req) => req.method === 'GET', // Don't limit GET requests
});

app.use('/api/', limiter);

// Routes
app.use('/api/auth', require('../server/routes/auth'));
app.use('/api/products', require('../server/routes/products'));
app.use('/api/cart', require('../server/routes/cart'));
app.use('/api/orders', require('../server/routes/orders'));
app.use('/api/blog', require('../server/routes/blog'));
app.use('/api/books', require('../server/routes/books'));
app.use('/api/favorites', require('../server/routes/favorites'));
app.use('/api/news', require('../server/routes/news'));

// Root route - API info
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'NISKAUPS API is running 🚀 (Vercel Serverless)',
    version: '1.0.0',
    environment: 'serverless',
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
    message: 'Server is running (Vercel Serverless)',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Test route
app.get('/api/test', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'API working correctly ✅ (Vercel Serverless)',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
  });
});

// Error handling middleware
app.use(errorHandler);

// Export serverless handler
module.exports = serverless(app);

// For local development (when running directly)
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  const server = require('http').createServer(app);
  
  server.listen(PORT, () => {
    console.log('\n' + '='.repeat(60));
    console.log('✅ NISKAUPS API SERVER STARTED (Development)');
    console.log('='.repeat(60));
    console.log(`Environment: development`);
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
}
