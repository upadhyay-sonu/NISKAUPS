✦ Environment Variables Reference

Add these variables to your server/.env file:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/niskaups

# JWT Authentication
JWT_SECRET=your_32_character_random_secret_key_here

# Server
PORT=5000
NODE_ENV=production

# Frontend URL
CLIENT_URL=http://localhost:5173

# Google Books API
GOOGLE_BOOKS_KEY=AIzaSyDZsFvf2TfGpYgKgDvpF3b2gmEzVh7lXkA

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_specific_password

# Stripe (Optional)
STRIPE_PUBLIC_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx

# Cloudinary (Optional)
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

◆ GOOGLE_BOOKS_KEY
The API key for Google Books API integration.
Used by GET /api/books endpoint to fetch book data.
Keep this secret and never expose in client-side code.

◆ Security Notes
Never commit .env file to git
Never hardcode secrets in source code
Store all API keys in environment variables only
Rotate keys periodically
Use app-specific passwords for SMTP
