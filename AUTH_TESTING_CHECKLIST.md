# Authentication Testing Checklist

## Quick Test Steps

### ✅ Test 1: Registration and Login
1. Navigate to `/register`
2. Fill in: Name, Email, Password, Confirm Password
3. Click Register
4. Should redirect to home page
5. Header should show user name and logout button
6. Check localStorage in DevTools:
   - `token` should exist
   - `user` should contain user data

**Expected Result**: User is logged in and token is stored

---

### ✅ Test 2: Login with Existing Account
1. Logout first (click logout in header)
2. Navigate to `/login`
3. Enter valid email and password
4. Click Login
5. Should redirect to home page
6. User should remain logged in

**Expected Result**: Successful login with token persisted

---

### ✅ Test 3: Session Persistence (Reload Test)
1. Log in successfully
2. Verify header shows logged-in state
3. Press F5 or Ctrl+R to refresh page
4. Wait for page to fully load
5. Check if user is still logged in
6. Header should still show user name

**Expected Result**: User remains logged in after page refresh

---

### ✅ Test 4: Protected Route Without Login
1. Clear localStorage (DevTools → Application → Clear All)
2. Navigate to `/cart` (or any protected route)
3. Should immediately redirect to `/login`

**Expected Result**: User is redirected to login page

---

### ✅ Test 5: Protected Route With Login
1. Log in successfully
2. Navigate to `/cart`
3. Cart page should load and display items
4. Try `/orders`, `/favorites`, `/dashboard`
5. All should load successfully

**Expected Result**: All protected routes are accessible

---

### ✅ Test 6: Public Routes (No Login Required)
1. Clear localStorage (logout)
2. Navigate to `/` (home)
3. Should load without redirecting to login
4. Click "Explore Collections" button
5. Should navigate to `/books/current`
6. Browse `/books/signed` and `/books/special`
7. Try `/product/:id` page
8. All should work without login

**Expected Result**: Public routes are fully accessible without authentication

---

### ✅ Test 7: Explore Collections Button
**Scenario A: Logged Out**
1. Clear localStorage
2. Go to home page
3. Click "Explore Collections" button
4. Should go to `/books/current`
5. Should NOT redirect to login

**Scenario B: Logged In**
1. Log in first
2. Go to home page
3. Click "Explore Collections" button
4. Should go to `/books/current`
5. Cart icon in header should show items if any

**Expected Result**: Button works the same for both logged-in and logged-out users

---

### ✅ Test 8: Logout Functionality
1. Log in successfully
2. Click user icon in header (top right)
3. Click "Logout" button
4. Should redirect to home page
5. Header should show login icon (not user name)
6. Check localStorage - `token` and `user` should be empty

**Expected Result**: User is logged out and data is cleared

---

### ✅ Test 9: Cart Access Flow
1. Log in
2. Go to home page → "Featured Books" section
3. Click on a book
4. Add to cart (if button exists)
5. Navigate to `/cart`
6. Should show cart items
7. Logout
8. Try to access `/cart` directly in URL
9. Should redirect to login

**Expected Result**: Cart is protected; unauthenticated users can't access it

---

### ✅ Test 10: Orders Page
1. Log in
2. Navigate to `/orders`
3. Should display order history (if any)
4. Try to access `/orders` while logged out
5. Should redirect to login

**Expected Result**: Orders page is protected

---

### ✅ Test 11: Invalid Credentials
1. Go to `/login`
2. Enter wrong email/password
3. Click Login
4. Error message should appear
5. Should NOT proceed to home page
6. User should remain on login page

**Expected Result**: Invalid credentials are rejected with error message

---

### ✅ Test 12: Duplicate Registration
1. Register with an email
2. Wait for successful registration
3. Go back to `/register`
4. Try to register with the same email
5. Error message should appear: "User already exists"

**Expected Result**: Duplicate emails are prevented

---

### ✅ Test 13: Token Expiration Handling
1. Log in successfully
2. Open DevTools → Application → localStorage
3. Delete the `token` key manually
4. Try to access `/cart` or `/orders`
5. Should redirect to `/login`
6. Should show error message

**Expected Result**: App handles missing/invalid tokens gracefully

---

### ✅ Test 14: Header Responsive State
**When Logged In:**
- Header shows user icon (top right)
- Hovering shows user name, email, Dashboard, and Logout options

**When Logged Out:**
- Header shows login icon
- Clicking navigates to `/login`

**Expected Result**: Header correctly reflects authentication state

---

### ✅ Test 15: Cross-Tab Logout
1. Open application in two browser tabs
2. Log in in Tab 1
3. Go to Tab 2 (same site)
4. Refresh Tab 2
5. Should show logged-in state
6. Logout in Tab 1
7. Go to Tab 2 and refresh
8. Should show logged-out state (localStorage cleared)

**Expected Result**: Authentication state syncs across tabs

---

## Debugging Tips

### Check Redux State
Open DevTools (F12) → Console and run:
```javascript
// Install Redux DevTools extension for better debugging
// Or check state manually:
localStorage.getItem('token')      // Should return JWT token
localStorage.getItem('user')        // Should return user JSON
```

### Check Network Requests
1. Open DevTools → Network tab
2. Log in
3. Look for `POST /api/auth/login`
4. Response should contain `token` and `user`
5. Check Request Headers for `Authorization: Bearer {token}`

### Check API Errors
1. Open DevTools → Console
2. Navigate to a protected route
3. Check for error messages
4. Look for 401 status codes

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| User logged out after refresh | Check if `initializeAuth` is being called in App.jsx |
| "Not authorized" error on protected routes | Verify ProtectedRoute wrapper is used in App.jsx |
| Can't access `/cart` even when logged in | Clear cache and localStorage, then log in again |
| Token not being sent to API | Check axios interceptor in `api.js` |
| Infinite redirect loop | Check for circular route dependencies |
| User stays logged in but can't access API | Token might be expired; re-login required |

---

## Test Data

### Sample Account for Testing
```
Email: test@example.com
Password: Test123!
Name: Test User
```

Or create your own account via registration form.

---

## Performance Notes

- App initialization takes ~100-200ms due to localStorage reads
- Protected route checks are instant (Redux state, no API call)
- API requests include token automatically (no manual header setting needed)
- Page refreshes restore auth state within 50ms

---

## Success Criteria

All tests should pass:
- ✅ Login/Register works
- ✅ Session persists after reload
- ✅ Protected routes are protected
- ✅ Public routes are public
- ✅ Logout clears all data
- ✅ No repeated login prompts
- ✅ Explore Collections works for all users
- ✅ Cart/Orders/Favorites require authentication
