✦ Niskaups - Quick Reference Card

✦ Start Development

```bash
# Terminal 1: Backend
cd server && npm run dev

# Terminal 2: Frontend
cd client && npm run dev

# Open http://localhost:5173
```

---

## 📍 Key File Locations

| Purpose | File |
|---------|------|
| Backend entry | `server/server.js` |
| Frontend entry | `client/src/App.jsx` |
| Database connection | `server/config/database.js` |
| API base URL | `client/src/config/api.js` |
| Theme colors | `client/tailwind.config.js` |
| Global styles | `client/src/index.css` |
| Redux store | `client/src/redux/store.js` |
| Environment vars | `.env` |

---

## 🎨 Styling Quick Tips

### Change Primary Color
```javascript
// tailwind.config.js
primary: '#your_color',
```

### Add Tailwind Class
```jsx
<div className="px-4 py-2 bg-primary text-white rounded-lg">
  Content
</div>
```

### Responsive Design
```jsx
<div className="w-full md:w-1/2 lg:w-1/3">
  Mobile: full width
  Tablet: 50% width
  Desktop: 33% width
</div>
```

---

## 🔐 Authentication

### Protect a Page
```jsx
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function ProtectedPage() {
  const { token } = useSelector(state => state.auth);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!token) navigate('/login');
  }, [token]);
  
  return <div>Protected content</div>;
}
```

### Get User Data
```jsx
const user = useSelector(state => state.auth.user);
const token = useSelector(state => state.auth.token);
```

### Logout
```jsx
import { useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';

const dispatch = useDispatch();
dispatch(logout());
```

---

✦ Cart Operations

### Add to Cart
```javascript
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';

const dispatch = useDispatch();
dispatch(addToCart({
  id: productId,
  title: productTitle,
  price: productPrice,
  quantity: 1
}));
```

### Get Cart Items
```javascript
const cartItems = useSelector(state => state.cart.items);
```

### Cart Count
```javascript
const count = useSelector(state => state.cart.items.length);
```

---

## 📡 API Calls

### Fetch Products
```javascript
import api from '../config/api';

const fetchProducts = async () => {
  const response = await api.get('/products', {
    params: { category: 'current', sort: 'newest' }
  });
  console.log(response.products);
};
```

### Create Order
```javascript
const createOrder = async (address) => {
  const response = await api.post('/orders', {
    shippingAddress: address,
    shippingCost: 10
  });
  console.log(response.order);
};
```

### Protected Request (Auto-adds token)
```javascript
// Token is automatically added by interceptor
const user = await api.get('/auth/me');
```

---

## 🎬 Animations

### Fade In
```jsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
>
  Content
</motion.div>
```

### Slide & Fade
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
>
  Content
</motion.div>
```

### Hover Scale
```jsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Click me
</motion.button>
```

### Staggered Children
```jsx
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    hidden: { opacity: 0 },
    visible: { transition: { staggerChildren: 0.1 } }
  }}
>
  {items.map(item => (
    <motion.div key={item.id} variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
      {item.name}
    </motion.div>
  ))}
</motion.div>
```

---

## 📦 API Endpoints

### Auth
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me        (protected)
POST   /api/auth/logout    (protected)
```

### Products
```
GET    /api/products?category=current&sort=newest
GET    /api/products/:id
POST   /api/products       (admin)
PUT    /api/products/:id   (admin)
DELETE /api/products/:id   (admin)
POST   /api/products/:id/reviews (protected)
```

### Cart
```
GET    /api/cart                    (protected)
POST   /api/cart/add                (protected)
PUT    /api/cart/update/:productId  (protected)
DELETE /api/cart/remove/:productId  (protected)
DELETE /api/cart/clear              (protected)
```

### Orders
```
POST   /api/orders         (protected)
GET    /api/orders         (protected)
GET    /api/orders/:id     (protected)
```

### Blog
```
GET    /api/blog
GET    /api/blog/:slug
POST   /api/blog           (admin)
PUT    /api/blog/:id       (admin)
DELETE /api/blog/:id       (admin)
```

---

## 🧪 Test Accounts

### Create During Development
1. Go to http://localhost:5173/register
2. Fill form and submit
3. Auto-logged in
4. Stored in MongoDB

### Email/Password Examples
```
Email: test@example.com
Password: Password123

Email: admin@niskaups.com
Password: AdminPass123
```

---

## 🐛 Common Issues & Fixes

### "Cannot GET /api/products"
- Backend not running
- API URL not configured
- Check `client/src/config/api.js`

### "MongoDB connection error"
- Check internet connection
- Verify MongoDB URI in `.env`
- Whitelist IP in MongoDB Atlas

### "Token is invalid"
- Token expired (7 days)
- Clear localStorage and re-login
- Check JWT_SECRET matches

### "CORS error"
- Backend not running
- Check CORS config in server.js
- Verify CLIENT_URL in backend .env

### Styles not applying
- Check Tailwind classes
- Restart Vite dev server
- Clear browser cache

---

## 📁 Adding New Features

### New Product Category
```javascript
// 1. Update model: server/models/Product.js
category: { enum: ['current', 'signed', 'special', 'coming-soon', 'YOUR_CATEGORY'] }

// 2. Create page: client/src/pages/YourCategory.jsx
// 3. Add route: client/src/App.jsx
<Route path="/books/your-category" element={<YourCategory />} />

// 4. Add link: client/src/components/Header.jsx
<Link to="/books/your-category">Your Category</Link>
```

### New Page
```javascript
// 1. Create component: client/src/pages/NewPage.jsx
export default function NewPage() { ... }

// 2. Add route: client/src/App.jsx
<Route path="/new-page" element={<NewPage />} />

// 3. Add link: client/src/components/Header.jsx
<Link to="/new-page">New Page</Link>
```

### New Redux Slice
```javascript
// 1. Create: client/src/redux/newSlice.js
import { createSlice } from '@reduxjs/toolkit';
export const newSlice = createSlice({ ... });
export default newSlice.reducer;

// 2. Add to store: client/src/redux/store.js
import newReducer from './newSlice';
reducer: { ..., new: newReducer }

// 3. Use in component
import { useSelector, useDispatch } from 'react-redux';
const data = useSelector(state => state.new);
```

---

## 🚢 Deployment Checklist

- [ ] Change JWT_SECRET
- [ ] Set NODE_ENV=production
- [ ] Update API_URL to production
- [ ] Configure Stripe keys
- [ ] Configure MongoDB Atlas
- [ ] Test all features
- [ ] Deploy frontend to Vercel
- [ ] Deploy backend to Render
- [ ] Set environment variables on platforms
- [ ] Test production deployment
- [ ] Set up monitoring

---

## 🎨 Design Tokens

### Colors
```
Primary:    #111111
Accent:     #f5f5f5
Text:       #333333
Success:    #10b981
Error:      #ef4444
Warning:    #f59e0b
```

### Spacing
```
xs: 0.25rem    (4px)
sm: 0.5rem     (8px)
md: 1rem       (16px)
lg: 1.5rem     (24px)
xl: 2rem       (32px)
```

### Breakpoints
```
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

---

✦ Useful Commands

```bash
# Backend
npm run dev        # Start dev server with nodemon
npm run start      # Start production server

# Frontend
npm run dev        # Start Vite dev server
npm run build      # Build for production
npm run preview    # Preview production build

# Database
npm install        # Install dependencies
npm install <pkg>  # Install new package
npm uninstall <pkg> # Remove package

# Git
git add .          # Stage changes
git commit -m "msg" # Commit changes
git push           # Push to GitHub
```

---

## 💡 Pro Tips

1. **Use Redux DevTools** - Debug state changes
2. **Check Network Tab** - See API requests/responses
3. **Console Logs** - Temporary debugging
4. **Postman** - Test API endpoints
5. **MongoDB Compass** - View database locally
6. **Lighthouse** - Check performance
7. **React DevTools** - Inspect components

---

✦ Next Priority Tasks

1. **Test Locally** - Run both servers, test features
2. **Customize Brand** - Change colors, logo, text
3. **Add Products** - Import books to MongoDB
4. **Deploy** - Follow DEPLOYMENT.md
5. **Configure Services** - Stripe, Cloudinary, Email
6. **Monitor** - Set up error tracking

---

## 📞 Quick Support

**Backend logs:** Check terminal where `npm run dev` runs
**Frontend logs:** Check browser console (F12)
**Database:** Check MongoDB Atlas dashboard
**Deployment:** Check Vercel/Render dashboards

---

Save this file for quick reference while developing.
