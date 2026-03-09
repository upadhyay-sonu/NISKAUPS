const axios = require('axios');

const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';

exports.getBooks = async (req, res) => {
  try {
    const apiKey = process.env.GOOGLE_API_KEY || process.env.GOOGLE_BOOKS_KEY;

    console.log('Fetching books with API key:', apiKey ? 'Present' : 'Missing');

    if (!apiKey) {
      console.error('Google API key not found in environment variables');
      return res.status(500).json({
        success: false,
        message: 'Google API key is not configured',
      });
    }

    const query = 'subject:photography OR subject:art OR subject:design';

    console.log('Requesting Google Books API with query:', query);

    const response = await axios.get(GOOGLE_BOOKS_API, {
      params: {
        q: query,
        maxResults: 40,
        key: apiKey,
      },
    });

    console.log('Google Books API response received, items count:', response.data.items?.length || 0);

    if (!response.data.items || response.data.items.length === 0) {
      console.warn('No items returned from Google Books API');
      return res.status(200).json({
        success: true,
        books: [],
        count: 0,
        message: 'No books found',
      });
    }

    const books = response.data.items
      .filter((item) => {
        const volumeInfo = item.volumeInfo || {};
        const hasImage = volumeInfo.imageLinks && volumeInfo.imageLinks.thumbnail;
        return hasImage;
      })
      .map((item) => {
        const volumeInfo = item.volumeInfo || {};
        return {
          id: item.id,
          title: volumeInfo.title || 'Untitled',
          authors: volumeInfo.authors || [],
          description: volumeInfo.description || '',
          publishedDate: volumeInfo.publishedDate || '',
          thumbnail: volumeInfo.imageLinks?.thumbnail || '',
          categories: volumeInfo.categories || [],
          previewLink: volumeInfo.previewLink || '',
        };
      });

    console.log('Filtered books count:', books.length);

    res.status(200).json({
      success: true,
      count: books.length,
      books,
    });
  } catch (error) {
    console.error('Google Books API Error:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      code: error.code,
    });

    res.status(500).json({
      success: false,
      message: 'Failed to fetch books from Google Books API',
      error: error.message,
    });
  }
};
