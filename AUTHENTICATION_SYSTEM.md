# Authentication System - Implementation Guide

## Overview

The application now implements a professional authentication system similar to e-commerce platforms like Amazon. Users remain logged in across sessions, and the app properly manages protected vs. public routes.

## Key Features

### 1. **Persistent Login Sessions**
- JWT tokens are stored in localStorage
- User data is persisted and restored on page reload
- Users stay logged in until they manually log out
- No repeated login prompts after successful authentication

### 2. **Protected Routes**
The following routes are protected and require authentication:
- `/cart` - Shopping cart
- `/checkout` - Checkout page
- `/dashboard` - User dashboard
- `/favorites` - Favorite books
- `/orders` - Order history
- `/payment/:orderId` - Payment page
- `/order-confirmation/:orderId` - Order confirmation

### 3. **Public Routes**
These routes are accessible without authentication:
- `/` - Home page
- `/books/:category` - Book collections (Current Selection, Signed Books, Special Editions)
- `/product/:id` - Product detail page
- `/login` - Login page
- `/register` - Registration page
- `/news` - News page
- `/about` - About page
- `/contact` - Contact page
- `/destination` - Destination page

### 4. **No Login Redirect for Public Routes**
Users can browse the catalog without logging in. The "Explore Collections" button on the home page directs to `/books/current` (a public route) and works for both logged-in and non-logged-in users.

## Architecture

### File Structure
```
client/
├── src/
│   ├── components/
│   │   └── ProtectedRoute.jsx       (NEW - Route protection wrapper)
│   ├── config/
│   │   └── api.js                   (UPDATED - Improved error handling)
│   ├── pages/
│   │   ├── Login.jsx                (UPDATED - Better response handling)
│   │   ├── Register.jsx             (UPDATED - Better response handling)
│   │   ├── Cart.jsx                 (UPDATED - Removed manual token checks)
│   │   ├── Favorites.jsx            (UPDATED - Removed manual token checks)
│   │   └── Orders.jsx               (UPDATED - Removed manual token checks)
│   ├── redux/
│   │   └── authSlice.js             (UPDATED - Added initializeAuth action)
│   └── App.jsx                      (UPDATED - Protected routes implementation)
```

## Component Details

### 1. ProtectedRoute Component
Wraps protected routes and checks for valid authentication tokens:

```jsx
<ProtectedRoute>
  <Cart />
</ProtectedRoute>
```

- If token exists in Redux state → renders the component
- If token missing → redirects to `/login`
- Component is used in App.jsx for all protected routes

### 2. Redux Auth Slice
Enhanced with session persistence:

**Actions:**
- `initializeAuth` - Restores auth state from localStorage on app load
- `loginSuccess` / `registerSuccess` - Stores token and user in localStorage and Redux
- `logout` - Clears token and user from both localStorage and Redux
- `loginFailure` / `registerFailure` - Handles errors

**State Structure:**
```javascript
{
  user: {
    id: string,
    name: string,
    email: string,
    role: string
  },
  token: string,
  isLoading: boolean,
  error: null | string
}
```

### 3. API Configuration
Updated axios interceptor to handle authentication properly:

**Request Interceptor:**
- Automatically adds `Authorization: Bearer {token}` header to all requests
- Retrieves token from localStorage

**Response Interceptor:**
- On 401 (Unauthorized): Clears localStorage and redirects to login
- Excludes `/auth/verify` endpoint from automatic redirect (for future verification endpoints)
- Doesn't redirect if already on login page

### 4. App.jsx Architecture
Implements initialization and route structure:

```javascript
const AppContent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize auth on app load
    dispatch(initializeAuth());
  }, [dispatch]);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      
      {/* Protected routes */}
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
```

## Flow Diagrams

### Login Flow
```
User submits credentials
         ↓
POST /api/auth/login
         ↓
Server returns { token, user }
         ↓
Redux: loginSuccess dispatched
         ↓
localStorage: token and user stored
         ↓
Redux state updated
         ↓
Navigate to home page
```

### Initial Load Flow
```
App mounts
         ↓
AppContent useEffect fires
         ↓
dispatch(initializeAuth())
         ↓
Redux restores from localStorage:
  - token (if exists)
  - user (if exists)
         ↓
Routes render with auth state
         ↓
If protected route + no token → redirect to login
If protected route + token exists → render component
If public route → always render
```

### Protected Route Access
```
User clicks link to /cart
         ↓
ProtectedRoute component checks Redux state
         ↓
Does token exist?
  ├─ YES → Render <Cart />
  └─ NO → <Navigate to="/login" />
```

## Usage Examples

### Checking Authentication Status
```jsx
import { useSelector } from 'react-redux';

const MyComponent = () => {
  const { token, user } = useSelector((state) => state.auth);
  
  if (token) {
    return <p>Hello, {user.name}!</p>;
  }
  
  return <p>Please log in</p>;
};
```

### Logging Out
```jsx
import { useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';

const LogoutButton = () => {
  const dispatch = useDispatch();
  
  const handleLogout = () => {
    dispatch(logout()); // Clears Redux and localStorage
    navigate('/');
  };
  
  return <button onClick={handleLogout}>Logout</button>;
};
```

### Accessing User Data
```jsx
const { user } = useSelector((state) => state.auth);

// Available user properties:
console.log(user.name);   // User's full name
console.log(user.email);  // User's email
console.log(user.id);     // User's ID
console.log(user.role);   // User's role
```

## API Endpoints

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
  - Request: `{ name, email, password, confirmPassword }`
  - Response: `{ success, token, user }`

- `POST /api/auth/login` - Login user
  - Request: `{ email, password }`
  - Response: `{ success, token, user }`

- `GET /api/auth/me` - Get current user (Protected)
  - Response: `{ success, user }`

- `POST /api/auth/logout` - Logout user (Protected)
  - Response: `{ success, message }`

### Protected Endpoints
All protected endpoints expect:
```
Authorization: Bearer {token}
```

The token is automatically added by the axios interceptor in `api.js`.

## Testing Authentication

### Test Scenario 1: Login and Persistence
1. Navigate to `/login`
2. Enter valid credentials
3. Click Login
4. Verify redirect to home page
5. Refresh page (F5)
6. Verify user remains logged in
7. Header should show user name and logout option

### Test Scenario 2: Protected Route Access
1. Log out (clear localStorage manually if needed)
2. Navigate directly to `/cart` in URL bar
3. Verify redirect to `/login`
4. Log in with valid credentials
5. Navigate to `/cart`
6. Verify cart loads successfully

### Test Scenario 3: Public Route Access
1. Log out
2. Navigate to `/` (home)
3. Verify home page loads
4. Click "Explore Collections" button
5. Verify `/books/current` loads (no login required)
6. Same for `/books/signed` and `/books/special`

### Test Scenario 4: Token Expiration
1. Log in successfully
2. Manually delete token from localStorage (DevTools → Application → localStorage)
3. Try to access `/cart`
4. Verify redirect to `/login`
5. Error message should appear

## Error Handling

### Login/Register Errors
Errors from the API are displayed to the user via toast notifications:
- "Invalid credentials" - Wrong email or password
- "User already exists" - Email already registered
- "Please provide all required fields" - Missing form fields
- Server-side errors are displayed as-is

### Protected Route Errors
If a user loses authentication while on a protected page:
- They are redirected to `/login`
- An error toast is shown
- They can log back in and continue

## Future Enhancements

### Recommended Improvements
1. **Token Refresh**: Implement refresh token mechanism for long-lived sessions
2. **Remember Me**: Add "Remember Me" checkbox for extended login duration
3. **Session Timeout**: Implement automatic logout after inactivity
4. **Two-Factor Authentication**: Add email/SMS verification
5. **OAuth Integration**: Support Google/GitHub login
6. **Role-Based Access Control**: Different permissions for admin vs. user roles

## Troubleshooting

### User keeps getting redirected to login
- **Cause**: Token expired or invalid
- **Solution**: Log out and log back in

### "Not authorized to access this route" error
- **Cause**: API endpoint requires authentication but token not being sent
- **Solution**: Verify ProtectedRoute wrapper is used for the page

### localStorage shows token but user not logged in
- **Cause**: App didn't call `initializeAuth` on load
- **Solution**: Verify `useEffect` in AppContent is firing

### Can't access protected routes after login
- **Cause**: ProtectedRoute not implemented for that route
- **Solution**: Wrap the component with `<ProtectedRoute>` in App.jsx

## Server Requirements

The backend must implement:
1. JWT token generation on login/register
2. Token validation middleware on protected endpoints
3. Proper error codes (401 for unauthorized)
4. User data in token response

All of these are already implemented in the server files:
- `server/middleware/auth.js` - Token validation
- `server/controllers/authController.js` - Login/Register logic
- `server/routes/auth.js` - Auth endpoints
