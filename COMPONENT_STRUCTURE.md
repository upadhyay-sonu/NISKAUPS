# Component Structure & Architecture

## Component Hierarchy

```
App.jsx
├── Router
│   ├── Header
│   ├── Main Content
│   │   ├── Dashboard Page (/dashboard)
│   │   │   ├── Profile Tab
│   │   │   │   ├── Profile Info Card
│   │   │   │   └── Order Summary Cards
│   │   │   ├── My Orders Tab
│   │   │   │   ├── Filter/Pagination Bar
│   │   │   │   ├── Order Cards List
│   │   │   │   │   ├── Order Header (ID, Date, Status)
│   │   │   │   │   └── Items Preview Grid
│   │   │   │   └── Pagination Controls
│   │   │   └── Order Details Modal (Floating)
│   │   │       ├── Header with Close Button
│   │   │       ├── Timeline Section
│   │   │       ├── Order & Shipping Info Grid
│   │   │       ├── Items Details Section
│   │   │       ├── Order Summary Section
│   │   │       ├── Payment Info Section
│   │   │       └── Footer with Close Button
│   │   │
│   │   └── Orders Page (/orders)
│   │       ├── Header
│   │       ├── Filter Bar
│   │       │   ├── Status Buttons
│   │       │   └── Order Count Display
│   │       ├── Order Cards List
│   │       │   ├── Order Header (ID, Date, Status)
│   │       │   └── Items Preview Grid
│   │       ├── Pagination Controls
│   │       └── Order Details Modal (Floating)
│   │           ├── Header with Close Button
│   │           ├── Timeline Section
│   │           ├── Order & Shipping Info Grid
│   │           ├── Items Details Section
│   │           ├── Order Summary Section
│   │           ├── Payment Info Section
│   │           └── Footer with Close Button
│   │
│   └── Footer
```

## File Structure

```
client/
├── src/
│   ├── pages/
│   │   ├── Dashboard.jsx (621 lines)
│   │   │   ├── Dashboard Component (main)
│   │   │   │   ├── State Management
│   │   │   │   ├── API Integration
│   │   │   │   ├── Tab Navigation
│   │   │   │   ├── Profile Tab Rendering
│   │   │   │   ├── Orders Tab Rendering
│   │   │   │   ├── Pagination Logic
│   │   │   │   └── Status Functions
│   │   │   │
│   │   │   └── OrderDetailsModal Component
│   │   │       ├── Timeline Visualization
│   │   │       ├── Order Info Display
│   │   │       ├── Shipping Info Display
│   │   │       ├── Items Display
│   │   │       ├── Summary Display
│   │   │       └── Payment Info Display
│   │   │
│   │   └── Orders.jsx (650+ lines)
│   │       ├── Orders Component (main)
│   │       │   ├── State Management
│   │       │   ├── API Integration
│   │       │   ├── Filter Logic
│   │       │   ├── Pagination Logic
│   │       │   ├── Filter UI Rendering
│   │       │   ├── Order List Rendering
│   │       │   ├── Status Functions
│   │       │   └── Empty State Rendering
│   │       │
│   │       └── OrderDetailsModal Component
│   │           ├── Timeline Visualization
│   │           ├── Order Info Display
│   │           ├── Shipping Info Display
│   │           ├── Items Display
│   │           ├── Summary Display
│   │           └── Payment Info Display
│   │
│   ├── config/
│   │   └── api.js (API configuration - unchanged)
│   │
│   ├── redux/
│   │   ├── authSlice.js (unchanged)
│   │   └── store.js (unchanged)
│   │
│   └── App.jsx (routes configured)
│
└── package.json (no changes)
```

## Component Props & State

### Dashboard Component

#### State
```javascript
{
  activeTab: 'profile' | 'orders',
  orders: Array<Order>,
  selectedOrder: Order | null,
  loading: Boolean,
  currentPage: Number,
  ordersPerPage: 5
}
```

#### Redux State Used
```javascript
{
  auth: {
    user: { name, email, role, createdAt },
    token: String
  }
}
```

### Orders Component

#### State
```javascript
{
  orders: Array<Order>,
  loading: Boolean,
  selectedOrder: Order | null,
  filterStatus: 'all' | 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled',
  currentPage: Number,
  ordersPerPage: 5
}
```

### OrderDetailsModal Component (Reused)

#### Props
```javascript
{
  order: Object {
    _id: String,
    createdAt: Date,
    items: Array<Item>,
    totalPrice: Number,
    orderStatus: String,
    paymentStatus: String,
    paymentMethod: String,
    transactionId: String,
    shippingAddress: Object
  },
  onClose: Function
}
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                       Redux Store (Auth)                        │
│                   { user, token, isAuth }                      │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────────┐
        │      Dashboard Page Component        │
        │  (useSelector to get auth state)     │
        └──────────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────────┐
        │   API Call: GET /api/orders           │
        │   (JWT token from auth state)         │
        └──────────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────────┐
        │    Backend API Server                │
        │  (Verify JWT, fetch user orders)     │
        └──────────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────────┐
        │      MongoDB Orders Collection       │
        │   (Find orders where user._id = x)   │
        └──────────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────────┐
        │  Return Orders Array with Details    │
        │  (items, status, payment, shipping)  │
        └──────────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────────┐
        │  Store in Component State: orders[]  │
        └──────────────────────────────────────┘
                           │
                ┌──────────┴──────────┐
                │                     │
                ▼                     ▼
        ┌──────────────────┐  ┌──────────────────┐
        │ Render Tab Tabs  │  │ Filter & Paginate│
        │ Profile/Orders   │  │ Orders List      │
        └──────────────────┘  └──────────────────┘
                │                     │
                └──────────┬──────────┘
                           │
                ┌──────────┴──────────┐
                │                     │
                ▼                     ▼
        ┌──────────────────┐  ┌──────────────────┐
        │   Order Cards    │  │  Click Handler   │
        │   Display        │  │  "View Details"  │
        └──────────────────┘  └──────────────────┘
                                      │
                                      ▼
                            ┌──────────────────────┐
                            │  Open Modal with     │
                            │  selected order data │
                            └──────────────────────┘
```

## Function Reference

### Dashboard.jsx Functions

#### Main Component
```javascript
const Dashboard = () => {
  // State hooks, effects, fetch logic
  useEffect(() => { fetchOrders() }, [token])
  
  // Helper functions
  const fetchOrders = async () => { ... }
  const handleLogout = () => { ... }
  const getStatusColor = (status) => { ... }
  const getPaymentStatusColor = (status) => { ... }
  const getStatusIcon = (status) => { ... }
  
  // JSX rendering
  return (
    <motion.div>
      {/* Profile Tab */}
      {activeTab === 'profile' && ...}
      
      {/* Orders Tab */}
      {activeTab === 'orders' && ...}
      
      {/* Modal */}
      {selectedOrder && <OrderDetailsModal />}
    </motion.div>
  )
}
```

#### Modal Component
```javascript
const OrderDetailsModal = ({ order, onClose }) => {
  return (
    <motion.div> {/* Modal Overlay */}
      <motion.div> {/* Modal Container */}
        {/* Header */}
        {/* Timeline */}
        {/* Order Info */}
        {/* Shipping Address */}
        {/* Items List */}
        {/* Order Summary */}
        {/* Payment Info */}
        {/* Footer */}
      </motion.div>
    </motion.div>
  )
}
```

### Orders.jsx Functions

#### Main Component
```javascript
const Orders = () => {
  // State hooks, effects, fetch logic
  useEffect(() => { fetchOrders() }, [])
  
  // Helper functions
  const fetchOrders = async () => { ... }
  const getStatusIcon = (status) => { ... }
  const getStatusBadgeClass = (status) => { ... }
  const getPaymentStatusColor = (status) => { ... }
  
  // Filtering & pagination logic
  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(o => o.orderStatus === filterStatus)
  
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex)
  
  // JSX rendering
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Filter Bar */}
      {/* Orders List */}
      {/* Pagination */}
      {/* Modal */}
      {selectedOrder && <OrderDetailsModal />}
    </div>
  )
}
```

#### Modal Component
```javascript
const OrderDetailsModal = ({ order, onClose }) => {
  return (
    <motion.div> {/* Same as Dashboard Modal */}
      {/* ...content... */}
    </motion.div>
  )
}
```

## Styling Architecture

### Tailwind CSS Classes Used

#### Layout Classes
```javascript
// Grid layouts
'grid grid-cols-1 md:grid-cols-2 md:grid-cols-5'
'flex flex-wrap gap-4'
'overflow-x-auto'

// Spacing
'p-6 p-8 p-12'
'mb-6 mb-12'
'gap-4 gap-6 gap-8'

// Display
'sticky top-0'
'fixed inset-0'
'z-50'
'min-h-screen'
```

#### Component Classes
```javascript
// Cards
'bg-white border border-neutral-200 rounded-2xl p-8'
'bg-white border border-neutral-200 rounded-xl p-6'

// Badges
'px-3 py-1 rounded-full text-sm font-semibold'
'bg-green-100 text-green-700 border-green-300'

// Buttons
'px-6 py-3 bg-primary text-white rounded-lg'
'hover:bg-primary-dark transition-colors'
```

#### Animation Classes
```javascript
// Framer Motion
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
whileHover={{ y: -2 }}
transition={{ duration: 0.3 }}
```

## State Management Flow

```
┌─────────────────────────────────┐
│      Redux Auth Store           │
│  { user, token, isAuthenticated}│
└────────────┬────────────────────┘
             │
             │ useSelector
             ▼
┌─────────────────────────────────┐
│    Dashboard/Orders Component   │
│      Local State Hooks:         │
│  - orders[]                     │
│  - selectedOrder                │
│  - filterStatus                 │
│  - currentPage                  │
│  - loading                      │
└────────────┬────────────────────┘
             │
             │ API Call with token
             ▼
┌─────────────────────────────────┐
│      API Server                 │
│  (Protected endpoint)           │
└────────────┬────────────────────┘
             │
             │ Returns orders[]
             ▼
┌─────────────────────────────────┐
│    Component State Updated      │
│    setOrders(response.orders)   │
└────────────┬────────────────────┘
             │
             │ Re-render
             ▼
┌─────────────────────────────────┐
│      UI Components Rendered     │
│  - Profile card                 │
│  - Order cards                  │
│  - Modal (conditional)          │
└─────────────────────────────────┘
```

## API Integration

### API Call Pattern
```javascript
const fetchOrders = async () => {
  try {
    const response = await api.get('/orders')
    setOrders(response.data?.orders || [])
  } catch (error) {
    console.error('Failed to fetch orders:', error)
  } finally {
    setLoading(false)
  }
}
```

### Error Handling
- API errors logged to console
- Graceful fallback to empty array
- Loading states managed via boolean flag
- User redirected to login if no token

## Performance Optimizations

1. **API Calls**: Minimal - single call on component mount
2. **Pagination**: Client-side to avoid repeated API calls
3. **Filtering**: Client-side for instant UX
4. **Memoization**: Not required for current complexity
5. **Code Splitting**: Each page component is separate route
6. **Image Loading**: Uses existing product images (cached)

## Browser APIs Used

- **localStorage**: Retrieve JWT token
- **Date**: Format order dates
- **Array Methods**: Filter, slice, map, reduce
- **Object Methods**: Spread operator, destructuring

## Security Measures

- JWT token required for API calls
- Backend verifies user ownership of orders
- No sensitive data stored in state
- Modal overlay prevents interaction with background
- API errors don't expose sensitive information

## Responsive Design Breakpoints

```javascript
// Mobile First
'grid-cols-1'           // < 768px (mobile)
'md:grid-cols-2'        // >= 768px (tablet)
'lg:grid-cols-5'        // >= 1024px (desktop)

// Text Sizes
'text-sm'               // Mobile
'text-base'             // Tablet
'text-lg'               // Desktop
```

## Component Reusability

### OrderDetailsModal
- Used in both Dashboard and Orders pages
- Props-based configuration
- No hard dependencies on parent state
- Can be extracted to separate component file if needed

### Status Helper Functions
- Defined in both Dashboard and Orders
- Could be extracted to utils/orderHelpers.js
- Would eliminate code duplication

## Future Refactoring Suggestions

1. **Extract OrderDetailsModal**
   ```javascript
   // components/OrderDetailsModal.jsx
   export const OrderDetailsModal = ({ order, onClose }) => { ... }
   ```

2. **Create Order Utils**
   ```javascript
   // utils/orderHelpers.js
   export const getStatusColor = (status) => { ... }
   export const getPaymentStatusColor = (status) => { ... }
   export const getStatusIcon = (status) => { ... }
   ```

3. **Create Order Constants**
   ```javascript
   // constants/orderStatuses.js
   export const ORDER_STATUSES = { ... }
   export const PAYMENT_STATUSES = { ... }
   ```

4. **Create Custom Hook**
   ```javascript
   // hooks/useOrders.js
   export const useOrders = () => {
     const [orders, setOrders] = useState([])
     // ... logic ...
     return { orders, loading, fetchOrders }
   }
   ```
