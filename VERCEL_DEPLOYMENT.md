# Deploy Backend to Vercel (Serverless)

## Overview
Keep your existing Render deployment while adding Vercel as a backup serverless option.

---

## File Structure

```
niskaups/
├── api/
│   └── server.js              ← Vercel serverless handler
├── server/
│   ├── config/                ← Reused
│   ├── controllers/           ← Reused
│   ├── routes/                ← Reused
│   ├── middleware/            ← Reused
│   ├── models/                ← Reused
│   ├── server.js              ← Original (still works for Render)
│   └── package.json           ← Updated with serverless-http
├── client/                    ← Frontend (separate)
├── vercel.json                ← Vercel configuration
└── .vercelignore              ← Files to ignore on Vercel
```

---

## Step 1: Install Serverless HTTP

```bash
cd server
npm install serverless-http@3.2.0
```

---

## Step 2: Verify Files Created

✅ Created files:
- `/api/server.js` - Serverless handler
- `/vercel.json` - Vercel config
- `/server/package.json` - Updated with serverless-http

---

## Step 3: Update Frontend API URL

The frontend should use different URLs for different deployments:

### Option A: Use Environment Variables
```javascript
// client/src/config/api.js
const API_BASE_URL = 
  process.env.VITE_API_URL ||
  "https://niskaups-vercel.vercel.app/api" || // Vercel backup
  "https://niskaups.onrender.com/api";       // Render primary
```

### Option B: Keep Current Setup
- Current: `https://niskaups.onrender.com/api` (Primary)
- Vercel will be secondary backup

---

## Step 4: Deploy to Vercel

### Method 1: GitHub Integration (Recommended)

```bash
# 1. Commit all changes to Git
cd c:/Users/Sonuu/Desktop/Niskaups
git add .
git commit -m "Add Vercel serverless deployment"
git push origin main
```

Then:
1. Go to https://vercel.com
2. Click "New Project"
3. Select your GitHub repository
4. Click "Import"
5. Configure:
   - Framework: Node.js
   - Root Directory: . (root)
6. Add Environment Variables (click "Add"):
   - `MONGODB_URI` = [your MongoDB URI]
   - `GOOGLE_API_KEY` = [your Google API key]
   - `NODE_ENV` = production
7. Click "Deploy"

### Method 2: Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to project root
cd c:/Users/Sonuu/Desktop/Niskaups

# Login to Vercel
vercel login

# Deploy
vercel

# For production deployment
vercel --prod
```

---

## Step 5: Set Environment Variables on Vercel

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add:
   ```
   MONGODB_URI = [your MongoDB connection string]
   GOOGLE_API_KEY = [your Google Books API key]
   NODE_ENV = production
   FRONTEND_URL = https://niskaups.vercel.app (optional)
   ```

---

## Step 6: Test Deployment

Once deployed, verify these URLs work:

```bash
# Get your Vercel deployment URL (e.g., https://niskaups-vercel.vercel.app)

# Test root endpoint
curl https://niskaups-vercel.vercel.app/

# Test health check
curl https://niskaups-vercel.vercel.app/api/health

# Test products endpoint
curl https://niskaups-vercel.vercel.app/api/products

# Test single product
curl https://niskaups-vercel.vercel.app/api/products/[product-id]
```

---

## Expected Responses

### GET /
```json
{
  "success": true,
  "message": "NISKAUPS API is running 🚀 (Vercel Serverless)",
  "version": "1.0.0",
  "environment": "serverless",
  "endpoints": { ... }
}
```

### GET /api/health
```json
{
  "success": true,
  "message": "Server is running (Vercel Serverless)",
  "timestamp": "2024-03-18T10:30:00.000Z",
  "environment": "production"
}
```

### GET /api/test
```json
{
  "success": true,
  "message": "API working correctly ✅ (Vercel Serverless)",
  "timestamp": "2024-03-18T10:30:00.000Z"
}
```

---

## Comparison: Render vs Vercel

| Feature | Render | Vercel |
|---------|--------|--------|
| Status | Primary ✅ | Backup |
| URL | https://niskaups.onrender.com | https://niskaups-vercel.vercel.app |
| Type | Traditional Server | Serverless |
| Always Running | Yes | Cold starts possible |
| Cost | $7/month | Free tier + pay-as-you-go |
| Scaling | Manual | Automatic |

---

## Frontend Configuration

Keep primary as Render, use Vercel as fallback:

```javascript
// client/src/config/api.js
const API_BASE_URL = "https://niskaups.onrender.com/api";

// Or with fallback:
const API_BASE_URL = 
  import.meta.env.VITE_API_URL ||
  "https://niskaups.onrender.com/api";
```

---

## Troubleshooting

### "Route not found" on Vercel
- Check if `/api/server.js` was deployed
- Verify vercel.json routes are correct
- Check environment variables are set

### Database connection fails
- Verify MONGODB_URI is set correctly
- Check Vercel environment variables
- Test connection string locally

### CORS errors
- Verify FRONTEND_URL is in allowedOrigins
- Check CORS headers in /api/server.js
- Test with curl: `curl -i https://niskaups-vercel.vercel.app/api/health`

### Slow responses
- Vercel serverless has cold start delays
- First request may take 10-30 seconds
- Subsequent requests are fast

### 504 Timeout
- Check if MongoDB connection is slow
- Increase function timeout in vercel.json (maxDuration: 60)
- Optimize database queries

---

## Keep Both Deployments Running

**Recommended setup:**
1. **Primary:** Render (niskaups.onrender.com) - Always running
2. **Backup:** Vercel (niskaups-vercel.vercel.app) - Serverless fallback
3. **Frontend:** Points to Render, but can switch if needed

---

## Next Steps

1. ✅ Install serverless-http
2. ✅ Create /api/server.js
3. ✅ Create vercel.json
4. ✅ Git commit and push
5. ✅ Deploy to Vercel
6. ✅ Set environment variables
7. ✅ Test endpoints
8. ✅ Update frontend API URL if needed (optional)

---

## Rollback

If issues occur on Vercel:
1. Keep using Render (primary)
2. Delete Vercel project
3. All APIs continue working on Render

No changes needed to frontend or existing infrastructure!

---

## Support

If deployment fails:
1. Check Vercel deployment logs: https://vercel.com/dashboard → Select Project → Deployments
2. Verify environment variables are set
3. Check that serverless-http is installed
4. Review /api/server.js for syntax errors

---

**Status:** Ready for Vercel deployment! 🚀
