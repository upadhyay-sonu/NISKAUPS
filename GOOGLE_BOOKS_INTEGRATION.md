✦ Google Books API Integration

◆ Backend Setup

File: server/controllers/booksController.js
- Fetches books from Google Books API
- Filters books with valid thumbnails
- Normalizes response format
- Handles errors securely

File: server/routes/books.js
- Route: GET /api/books
- No authentication required
- Returns curated book data

File: server/server.js
- Route registered at /api/books

◆ Environment Configuration

Add to server/.env:
GOOGLE_BOOKS_KEY=AIzaSyDZsFvf2TfGpYgKgDvpF3b2gmEzVh7lXkA

The API key is loaded from process.env.GOOGLE_BOOKS_KEY and never exposed to frontend.

◆ API Endpoint

GET /api/books

Response on Success (200):
{
  "success": true,
  "count": 20,
  "books": [
    {
      "id": "book_id",
      "title": "Photography Basics",
      "authors": ["Author Name"],
      "description": "Book description...",
      "publishedDate": "2023-01-15",
      "thumbnail": "https://books.google.com/books/content?id=xxx&printsec=frontcover&img=1",
      "categories": ["Photography", "Design"],
      "previewLink": "https://books.google.com/books?id=xxx"
    }
  ]
}

Response on Error (500):
{
  "success": false,
  "message": "Failed to fetch books from external service"
}

◆ Query Parameters

Query: subject:photography OR subject:art OR subject:design
MaxResults: 20
Filters: Only books with valid thumbnail images

Modify the query in booksController.js line 20 to change book search criteria.

◆ Response Fields

▸ id - Google Books unique identifier
▸ title - Book title
▸ authors - Array of author names
▸ description - Book description text
▸ publishedDate - Publication date (YYYY-MM-DD format)
▸ thumbnail - Direct image URL for book cover
▸ categories - Subject categories array
▸ previewLink - Link to Google Books preview

◆ Frontend Usage

Call from client:
```javascript
const response = await api.get('/books');
const books = response.books;
```

Display book data in cards, grid, or list view.
Use thumbnail URLs as image sources.
Link previewLink to Google Books preview.

◆ Rate Limiting

The /api/books endpoint is subject to the global rate limit:
- 100 requests per 15 minutes per IP
- Adjust in server/server.js if needed

◆ Error Handling

Errors are logged internally with:
- Error message
- HTTP status
- API response data (if available)

Frontend receives generic error message:
"Failed to fetch books from external service"

This prevents API key exposure in error responses.

◆ Security Features

✓ API key stored only in server/.env
✓ No API key in response data
✓ No hardcoded secrets in code
✓ Error messages don't expose internals
✓ Rate limiting on all API routes
✓ CORS protection
✓ Security headers (Helmet)

◆ Testing

1. Start backend server:
cd server && npm run dev

2. Test endpoint:
curl http://localhost:5000/api/books

3. Verify response:
- Check for books array
- Verify thumbnail URLs are valid
- Check that all fields are present
- Confirm count matches books.length

4. Frontend integration:
Call api.get('/books') in your React component
Handle success/error states

◆ Troubleshooting

Issue: API returns empty array
Solution: Check GOOGLE_BOOKS_KEY is correct in .env

Issue: Books returned but no thumbnails
Solution: Google Books API filters books with images automatically

Issue: 500 error
Solution: Check server logs for detailed error message

Issue: Rate limit exceeded
Solution: Wait 15 minutes or adjust limiter settings

◆ Production Deployment

Before deploying:
1. Set GOOGLE_BOOKS_KEY in production environment variables
2. Verify CLIENT_URL matches production frontend URL
3. Set NODE_ENV=production
4. Test /api/books endpoint
5. Monitor error logs
6. Check rate limiting is appropriate

Never expose GOOGLE_BOOKS_KEY in:
- Frontend code
- Error messages
- Logs
- Documentation
- Git repositories
