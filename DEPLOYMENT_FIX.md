# Deployment Fix Guide - 404 Errors on Render

## Problem
After deployment on Render, API calls return 404 errors because the frontend is calling the wrong API endpoints.

## Root Cause
- Frontend was using hardcoded `localhost` URLs
- Cross-origin requests were blocked by CORS
- Environment variables not properly configured in production

## Solution

### 1. Frontend Configuration

#### Update `client/.env`
```env
# For local development:
VITE_API_URL=http://localhost:5000/api

# For production on Render:
VITE_API_URL=https://your-backend-service-name.onrender.com/api
```

**Important:** Replace `your-backend-service-name` with your actual Render backend service name.

#### Changes Made to Frontend Files

**`client/src/config/api.js`**
- Already configured to use `VITE_API_URL` environment variable
- Falls back to `http://localhost:5000/api` if not set
- Uses axios for all API requests

**`client/src/pages/News.jsx`**
- Updated to use `api.get()` instead of `fetch()`
- Now uses the centralized API configuration
- Will automatically use the correct backend URL

**`client/src/pages/Destination.jsx`**
- Updated to use `api.get()` instead of hardcoded localhost
- Removed hardcoded `http://localhost:5000` URLs

### 2. Backend Configuration

#### Update `server/.env`
```env
MONGODB_URI=your_mongodb_uri
GOOGLE_API_KEY=your_key
NEWSAPI_KEY=your_key
GUARDIAN_KEY=your_key
NYTIMES_KEY=your_key
GNEWS_KEY=your_key

# Add the frontend URL for CORS
FRONTEND_URL=https://your-frontend-service-name.onrender.com
PORT=5000
```

**Important:** Replace `your-frontend-service-name` with your actual Render frontend service name.

#### Changes Made to Backend Files

**`server/server.js`**
- Updated CORS configuration to accept production frontend URL
- Now reads `FRONTEND_URL` from environment variables
- Allows dynamic origin configuration for different environments

### 3. Deployment Steps on Render

#### For Backend Service:
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set Environment Variables in Render Dashboard:
   ```
   MONGODB_URI = your_mongodb_connection_string
   GOOGLE_API_KEY = your_google_api_key
   NEWSAPI_KEY = your_newsapi_key
   GUARDIAN_KEY = your_guardian_api_key
   NYTIMES_KEY = your_nytimes_api_key
   GNEWS_KEY = your_gnews_api_key
   FRONTEND_URL = https://your-frontend-url.onrender.com
   PORT = 5000
   ```
4. Set build command: `npm install`
5. Set start command: `npm start` (in server directory)
6. Deploy and note the service URL (e.g., `https://niskaups-api.onrender.com`)

#### For Frontend Service:
1. Create another Web Service for the frontend
2. Set Environment Variables in Render Dashboard:
   ```
   VITE_API_URL = https://your-backend-url.onrender.com/api
   ```
3. Set build command: `npm install && npm run build` (in client directory)
4. Set publish directory: `client/dist`
5. Deploy and note the service URL (e.g., `https://niskaups.onrender.com`)

### 4. Update Environment Variables After Deployment

Once you have your Render URLs:

**Backend .env on Render:**
```
FRONTEND_URL=https://niskaups.onrender.com
```

**Frontend .env on Render:**
```
VITE_API_URL=https://niskaups-api.onrender.com/api
```

### 5. Verify Deployment

1. Navigate to your frontend URL: `https://niskaups.onrender.com`
2. Open browser DevTools (F12)
3. Go to Network tab
4. Navigate to News page
5. Verify API calls are going to `https://niskaups-api.onrender.com/api/*`
6. Check that articles load without 404 errors

### 6. Troubleshooting

**Still getting 404 errors?**
- Check browser console (F12) for actual API URLs being called
- Verify CORS headers in response: `Access-Control-Allow-Origin`
- Ensure `FRONTEND_URL` is correctly set in backend .env
- Clear browser cache and reload

**CORS errors?**
- Verify `FRONTEND_URL` matches your frontend domain exactly
- Check that backend `server.js` is using the updated CORS configuration

**API returns empty?**
- Verify API keys in backend .env
- Check MongoDB connection string is correct
- Review backend logs for errors

### Summary of Changes

| File | Change |
|------|--------|
| `client/src/config/api.js` | Already uses `VITE_API_URL` env var |
| `client/src/pages/News.jsx` | Use `api.get()` instead of `fetch()` |
| `client/src/pages/Destination.jsx` | Use `api.get()` instead of hardcoded localhost |
| `client/.env` | Set `VITE_API_URL` for local development |
| `server/server.js` | CORS accepts `FRONTEND_URL` from env |
| `server/.env` | Add `FRONTEND_URL` variable |

All API requests now properly route through the centralized `api` configuration, which automatically uses the correct backend URL.
