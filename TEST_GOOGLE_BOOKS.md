✦ Testing Google Books Integration

◆ Prerequisites
- Backend running on http://localhost:5000
- GOOGLE_BOOKS_KEY configured in server/.env
- API key is valid and has quota remaining

◆ Test 1: Basic Endpoint Test

Using curl:
```bash
curl http://localhost:5000/api/books
```

Or using Postman:
1. Create new GET request
2. URL: http://localhost:5000/api/books
3. Send

Expected Response (200 OK):
```json
{
  "success": true,
  "count": 20,
  "books": [
    {
      "id": "xxx",
      "title": "...",
      "authors": [...],
      "description": "...",
      "publishedDate": "...",
      "thumbnail": "https://...",
      "categories": [...],
      "previewLink": "https://..."
    }
  ]
}
```

◆ Test 2: Response Validation

Check each book object has:
✓ id (string)
✓ title (string, not empty)
✓ authors (array)
✓ description (string, can be empty)
✓ publishedDate (string, can be empty)
✓ thumbnail (valid HTTPS URL)
✓ categories (array)
✓ previewLink (valid URL or empty)

◆ Test 3: Frontend Integration

In your React component:
```javascript
import api from '../config/api';

useEffect(() => {
  const fetchBooks = async () => {
    try {
      const response = await api.get('/books');
      console.log('Books:', response.books);
      // Use response.books in your UI
    } catch (error) {
      console.error('Failed to fetch books:', error);
    }
  };
  
  fetchBooks();
}, []);
```

◆ Test 4: Error Scenarios

Test 1 - Missing API Key:
1. Remove GOOGLE_BOOKS_KEY from .env
2. Restart backend
3. Call GET /api/books
4. Expected: 500 error with "Google Books API key is not configured"

Test 2 - Invalid API Key:
1. Set GOOGLE_BOOKS_KEY=invalid_key
2. Restart backend
3. Call GET /api/books
4. Expected: 500 error with "Failed to fetch books from external service"
5. Check backend logs for actual error

Test 3 - Network Error:
1. Disconnect internet temporarily
2. Call GET /api/books
3. Expected: 500 error
4. Check logs for network error

◆ Test 5: Response Size

Expected: ~20 books in response
Each book object: ~500-1000 bytes
Total response: ~10-20 KB

Monitor performance:
- Response time should be < 2 seconds
- Network payload under 50 KB

◆ Test 6: Image URLs

Each thumbnail URL should:
✓ Be valid HTTPS URL
✓ Start with https://
✓ Load successfully in browser
✓ Be from books.google.com domain

Test in browser:
Copy thumbnail URL and paste in new tab.
Should display book cover image.

◆ Backend Logs

When endpoint is called, you should see:
```
GET /api/books 200
```

On error, check console for:
```
Google Books API Error: {
  message: "...",
  status: 400,
  data: {...}
}
```

◆ Production Testing Checklist

Before deploying to production:

□ GOOGLE_BOOKS_KEY is set in production env vars
□ Tested with production API key
□ Response time is acceptable
□ No API key appears in logs or responses
□ Error messages are generic (no API details)
□ Rate limiting is working
□ CORS is configured correctly
□ All books have valid thumbnail URLs
□ Frontend displays books correctly
□ No console errors in browser DevTools

◆ Monitoring

Track in production:
- Response times (should be < 2s)
- Error rates (should be < 1%)
- API quota usage (check Google Cloud Console)
- Failed requests (check logs)

Set up alerts for:
- API key exhaustion
- High error rates
- Slow response times
