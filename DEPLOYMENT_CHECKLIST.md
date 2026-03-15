# Deployment Checklist - 404 Error Fix

## Pre-Deployment Checklist

### Frontend Setup
- [ ] Update `client/.env` with correct backend URL
  - Local: `VITE_API_URL=http://localhost:5000/api`
  - Production: `VITE_API_URL=https://your-backend.onrender.com/api`
- [ ] Verify `client/src/config/api.js` uses `VITE_API_URL`
- [ ] Verify `client/src/pages/News.jsx` uses `api.get()` not `fetch()`
- [ ] Verify `client/src/pages/Destination.jsx` uses `api.get()` not hardcoded URLs

### Backend Setup
- [ ] Update `server/.env` with all required API keys
- [ ] Add `FRONTEND_URL` to `server/.env`
  - Local: `FRONTEND_URL=http://localhost:5173`
  - Production: `FRONTEND_URL=https://your-frontend.onrender.com`
- [ ] Verify `server/server.js` has updated CORS configuration

### Test Locally
- [ ] Start backend: `npm start` (in server directory)
- [ ] Start frontend: `npm run dev` (in client directory)
- [ ] Open News page and verify articles load
- [ ] Open Destination page and verify books load
- [ ] Check browser console for API calls to correct URLs
- [ ] Verify no 404 errors in Network tab

## Deployment to Render

### Backend Service
1. [ ] Create Web Service on Render
2. [ ] Connect GitHub repository
3. [ ] Set Environment Variables:
   - [ ] MONGODB_URI
   - [ ] GOOGLE_API_KEY
   - [ ] NEWSAPI_KEY
   - [ ] GUARDIAN_KEY
   - [ ] NYTIMES_KEY
   - [ ] GNEWS_KEY
   - [ ] FRONTEND_URL (use frontend service URL from step 5)
   - [ ] PORT=5000
4. [ ] Build command: `npm install`
5. [ ] Start command: `npm start` (or adjust if needed for subdirectory)
6. [ ] Deploy and note the service URL

### Frontend Service
1. [ ] Create Web Service on Render
2. [ ] Connect GitHub repository
3. [ ] Set Environment Variables:
   - [ ] VITE_API_URL (use backend service URL from Backend Service step 6)
4. [ ] Build command: `npm install && npm run build`
5. [ ] Publish directory: `client/dist`
6. [ ] Deploy and note the service URL

### Post-Deployment Verification
1. [ ] Visit frontend URL in browser
2. [ ] Open DevTools (F12)
3. [ ] Go to Network tab
4. [ ] Navigate to News page
5. [ ] Verify API calls show `https://your-backend.onrender.com/api/news/*`
6. [ ] Verify articles load without errors
7. [ ] Check Console for any errors
8. [ ] Verify CORS headers in response

## If You Get 404 Errors After Deployment

### Check API URLs
```javascript
// In browser console:
console.log(import.meta.env.VITE_API_URL)
// Should show: https://your-backend.onrender.com/api
```

### Check CORS
- Network tab → Select API request → Headers
- Look for: `Access-Control-Allow-Origin: https://your-frontend.onrender.com`

### Verify Backend Environment
- Go to Render dashboard
- Check backend service Environment tab
- Verify FRONTEND_URL matches your frontend service URL exactly

### Check Backend Routes
- Visit `https://your-backend.onrender.com/api/health`
- Should return: `{"success":true,"message":"Server is running"}`

### Update Environment if URLs Changed
If you changed your service names after initial deployment:
1. Update `FRONTEND_URL` in backend service environment
2. Update `VITE_API_URL` in frontend service environment
3. Redeploy both services

## Files Modified

| File | Purpose |
|------|---------|
| `client/.env` | Frontend environment configuration |
| `client/.env.example` | Reference for environment variables |
| `client/src/pages/News.jsx` | Use api.get() instead of fetch() |
| `client/src/pages/Destination.jsx` | Use api.get() instead of hardcoded localhost |
| `server/.env.example` | Reference for backend environment variables |
| `server/server.js` | Updated CORS to accept FRONTEND_URL |
| `DEPLOYMENT_FIX.md` | Detailed deployment guide |

## Quick Reference

### Local Development
```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
cd client
npm run dev

# Visit http://localhost:5173
```

### Production on Render
```
Frontend URL: https://niskaups.onrender.com
Backend URL: https://niskaups-api.onrender.com
API Base: https://niskaups-api.onrender.com/api
```

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| 404 on API calls | Check VITE_API_URL in frontend .env |
| CORS blocked | Verify FRONTEND_URL in backend .env |
| Articles not loading | Check Network tab for actual API URL |
| Empty response | Verify API keys in backend .env |
| Articles still use localhost | Clear browser cache and reload |

---
**Last Updated:** 2024
**Status:** Ready for deployment
