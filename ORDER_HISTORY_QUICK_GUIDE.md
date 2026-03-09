# Order History - Quick Reference Guide

## User Facing Features

### Dashboard Page (`/dashboard`)
The main account management hub with two tabs:

#### Profile Tab
- View personal information (name, email, role, member since)
- See order summary statistics
- View total amount spent
- Logout button

#### My Orders Tab
- View all orders placed by the user
- 5 orders per page with pagination
- Filter orders by status (All, Pending, Confirmed, Shipped, Delivered, Cancelled)
- Quick preview of each order:
  - Order ID
  - Order date
  - Order status (color-coded with icon)
  - Payment status
  - Total price
  - Item thumbnails
  - View Details button

### Orders Page (`/orders`)
Dedicated orders page with enhanced features:

#### Order Listing
- Filter by status using top bar
- Pagination controls
- Display count of visible orders
- Same order card layout as Dashboard

#### Order Details Modal
Click "View Details" to see:
- **Order Timeline**: Visual progression (Ordered → Confirmed → Shipped → Delivered)
- **Order Information**: Date, status, payment method
- **Shipping Address**: Full delivery address with contact info
- **Order Items**: Complete list with images, quantities, and prices
- **Order Summary**: Subtotal, shipping, tax, total breakdown
- **Payment Information**: Payment status and transaction ID

## Status Indicators

### Order Status
| Status | Color | Icon |
|--------|-------|------|
| Pending | Yellow | Clock |
| Confirmed | Blue | ShoppingBag |
| Shipped | Purple | AlertCircle |
| Delivered | Green | CheckCircle |
| Cancelled | Red | XCircle |

### Payment Status
| Status | Color |
|--------|-------|
| Pending | Yellow |
| Completed | Green |
| Failed | Red |
| Refunded | Blue |

## Data Flow

```
User Login
    ↓
Redux Auth State
    ↓
Dashboard / Orders Page
    ↓
API Call: GET /api/orders
    ↓
Display Orders List
    ↓
User Clicks "View Details"
    ↓
Open Modal with Order Details
```

## Navigation

- **From Dashboard**: Click "My Orders ({count})" tab to see orders list
- **From Orders Page**: Click "View Details" on any order card to see full details
- **Modal Close**: Click close button (×) or anywhere outside modal

## Features by Page

### Dashboard Page
- ✅ Tab navigation
- ✅ Profile information
- ✅ Order statistics
- ✅ Order list with pagination
- ✅ Order filter by status
- ✅ Order details modal
- ✅ Logout functionality

### Orders Page
- ✅ Order list with filter
- ✅ Pagination controls
- ✅ Order details modal
- ✅ Status badges with icons
- ✅ Item previews
- ✅ Empty state for no orders

## Mobile Responsiveness

- **Mobile (< 768px)**:
  - Single column layout for orders
  - Stacked order information
  - Horizontal scroll for items
  - Touch-friendly buttons and spacing

- **Tablet (768px - 1024px)**:
  - 2-column layout adapts
  - Improved spacing

- **Desktop (> 1024px)**:
  - Full 5-column layout
  - Optimized grid display
  - Larger previews

## Performance Notes

- **Pagination**: Loads 5 orders per page to minimize initial load
- **Modal**: Order details load on-demand when modal opens
- **Filter**: Applied client-side for instant filtering
- **Images**: Uses existing product images from order items

## API Integration

All order data comes from:
- **Endpoint**: `GET /api/orders` (authenticated)
- **Auth**: Requires JWT token in headers
- **Response**: Array of order objects with full details

## Accessibility

- Color-coded statuses have text labels
- Icons paired with text descriptions
- Semantic HTML structure
- Proper heading hierarchy
- Keyboard navigation support
- ARIA labels on interactive elements

## Error Handling

- Graceful loading states with skeleton screens
- Fallback empty state if no orders
- Error messages logged to console
- Automatic retry on token expiration via API middleware

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## Future Improvements

Potential features to consider:

1. **Order Actions**
   - Cancel order
   - Return items
   - Reorder items
   - Print order

2. **Notifications**
   - Order status updates
   - Email confirmations
   - Push notifications

3. **Advanced Filtering**
   - Date range filter
   - Price range filter
   - Search by order ID
   - Search by item name

4. **Tracking**
   - Real-time shipping tracking
   - Estimated delivery date
   - Tracking number

5. **Analytics**
   - Order history chart
   - Spending trends
   - Frequently ordered items

## Support Resources

- Check browser console for API errors
- Verify authentication token in localStorage
- Ensure backend API is running and accessible
- Check CORS configuration if API calls fail
