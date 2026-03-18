# Dual Deployment Setup - Render + Vercel

## Current Status

### ✅ Render (Primary)
- **Status:** Active & Running
- **URL:** https://niskaups.onrender.com
- **Type:** Traditional Node.js server
- **Cost:** $7/month
- **Uptime:** 24/7
- **Frontend:** Connected to this

### ✅ Vercel (Backup)
- **Status:** Ready to deploy
- **URL:** https://niskaups-vercel.vercel.app (after deployment)
- **Type:** Serverless Functions
- **Cost:** Free tier available
- **Scaling:** Automatic
- **Setup:** Complete, awaiting deployment

---

## What Was Created

### 1. Vercel Serverless Handler
**File:** `/api/server.js`
- Wraps Express app with serverless-http
- Exports handler instead of listening
- Reuses all existing routes
- Compatible with all original endpoints

### 2. Vercel Configuration
**File:** `/vercel.json`
- Routes all requests to `/api/server.js`
- Sets memory to 1024MB
- Sets max duration to 30 seconds
- Auto-sets environment variables

### 3. Git Ignore for Vercel
**File:** `/.vercelignore`
- Prevents unnecessary files from being deployed
- Keeps deployment size minimal

### 4. Updated Dependencies
**File:** `/server/package.json`
- Added `serverless-http@3.2.0`
- All other dependencies unchanged

---

## Deployment Commands

```bash
# 1. Install serverless-http
cd server
npm install

# 2. Commit changes
cd ..
git add .
git commit -m "Add Vercel serverless deployment"
git push origin main

# 3. Deploy to Vercel (choose one):

# Option A: Via Vercel Dashboard
# - Go to https://vercel.com
# - Import project from GitHub
# - Add environment variables
# - Click Deploy

# Option B: Via Vercel CLI
npm install -g vercel
vercel login
vercel --prod
```

---

## After Deployment

### Test Vercel
```bash
# These should all work:
curl https://niskaups-vercel.vercel.app/
curl https://niskaups-vercel.vercel.app/api/health
curl https://niskaups-vercel.vercel.app/api/test
curl https://niskaups-vercel.vercel.app/api/products
```

### Update Frontend (Optional)
Current setup uses Render (Primary):
```javascript
// Works as-is - no changes needed
const API_BASE_URL = "https://niskaups.onrender.com/api";
```

If you want automatic failover:
```javascript
const API_BASE_URL = 
  import.meta.env.VITE_API_URL ||
  "https://niskaups.onrender.com/api"; // Primary
  // Add Vercel fallback if needed
```

---

## File Structure

```
niskaups/
├── api/
│   └── server.js                    ← NEW: Vercel handler
├── server/
│   ├── server.js                    ← EXISTING: Render
│   ├── package.json                 ← UPDATED: Added serverless-http
│   ├── config/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   └── middleware/
├── client/
│   └── src/
├── vercel.json                      ← NEW: Vercel config
├── .vercelignore                    ← NEW: Vercel ignore
└── README.md
```

---

## Route Comparison

Both deployments support same routes:

```
✅ GET  /                    - API Info
✅ GET  /api/health          - Health Check
✅ GET  /api/test            - Test Endpoint
✅ GET  /api/products        - All Products
✅ GET  /api/products/:id    - Single Product
✅ POST /api/auth/login      - Login
✅ POST /api/auth/register   - Register
✅ POST /api/cart/add        - Add to Cart
✅ GET  /api/orders          - Orders
✅ POST /api/orders/create   - Create Order
✅ POST /api/favorites/add   - Add Favorite
```

---

## Environment Variables

### Required on Vercel
```
MONGODB_URI         → Your MongoDB connection string
GOOGLE_API_KEY      → Your Google Books API key
NODE_ENV            → production
FRONTEND_URL        → https://niskaups.vercel.app (optional)
```

---

## Why Both Deployments?

| Need | Solution |
|------|----------|
| Reliable 24/7 API | ✅ Render primary |
| Auto-scaling | ✅ Vercel secondary |
| Cost optimization | ✅ Free tier on Vercel |
| Redundancy | ✅ Two independent deployments |
| Zero downtime | ✅ Can failover if one goes down |

---

## Render vs Vercel: Quick Facts

### Render
- Always running server
- Good for persistent connections
- $7/month minimum
- Predictable costs
- Ideal for primary deployment

### Vercel
- Serverless functions
- Cold start delays (first request ~5-30s)
- Free tier available
- Auto-scaling
- Perfect for backup/failover

---

## Next Steps

1. ✅ Review `/api/server.js`
2. ✅ Review `/vercel.json`
3. ✅ Ensure dependencies updated
4. ⏳ Push to GitHub
5. ⏳ Deploy to Vercel (via dashboard or CLI)
6. ⏳ Set environment variables
7. ⏳ Test all endpoints
8. ⏳ Monitor Vercel deployment

---

## Support Resources

- **Vercel Docs:** https://vercel.com/docs
- **Serverless HTTP:** https://github.com/dougmoscrop/serverless-http
- **Express on Vercel:** https://vercel.com/docs/runtimes/node-js

---

## Important Notes

⚠️ **Database Connection**
- MongoDB must be accessible from Vercel IP
- Add `0.0.0.0/0` to MongoDB Atlas IP whitelist (or specific Vercel IPs)

⚠️ **Cold Starts**
- First request may take 10-30 seconds
- Subsequent requests are fast
- Can be mitigated with Vercel's `@next.js` cron

⚠️ **Function Limits**
- Max execution time: 30 seconds (configurable)
- Memory: 1024MB
- Request size: 4.5MB

---

**Status: Ready to Deploy! 🚀**

All files created and configured. Push to GitHub → Deploy on Vercel → Verify endpoints → Done!
