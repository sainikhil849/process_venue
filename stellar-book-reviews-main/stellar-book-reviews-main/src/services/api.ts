
import { Book, Review, CreateBookRequest, CreateReviewRequest, ApiResponse, ApiError } from '@/types/book';

// Mock cache simulation
class MockCache {
  private cache = new Map<string, any>();
  private isDown = false;

  set(key: string, value: any, ttl: number = 300): boolean {
    if (this.isDown) return false;
    this.cache.set(key, { value, expires: Date.now() + ttl * 1000 });
    return true;
  }

  get(key: string): any | null {
    if (this.isDown) return null;
    const item = this.cache.get(key);
    if (!item || Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }
    return item.value;
  }

  simulateDown() {
    this.isDown = true;
    setTimeout(() => this.isDown = false, 5000);
  }

  isOnline() {
    return !this.isDown;
  }
}

const mockCache = new MockCache();

// Mock database with indexing simulation
const mockBooks: Book[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    isbn: '978-0-7432-7356-5',
    publishedYear: 1925,
    genre: 'Classic Literature',
    description: 'A classic American novel set in the Jazz Age.',
    averageRating: 4.2,
    totalReviews: 156,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    isbn: '978-0-06-112008-4',
    publishedYear: 1960,
    genre: 'Classic Literature',
    description: 'A gripping tale of racial injustice and childhood innocence.',
    averageRating: 4.5,
    totalReviews: 289,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z'
  },
  {
    id: '3',
    title: '1984',
    author: 'George Orwell',
    isbn: '978-0-452-28423-4',
    publishedYear: 1949,
    genre: 'Dystopian Fiction',
    description: 'A dystopian social science fiction novel and cautionary tale.',
    averageRating: 4.3,
    totalReviews: 412,
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z'
  }
];

const mockReviews: Review[] = [
  {
    id: '1',
    bookId: '1',
    reviewerName: 'Alice Johnson',
    rating: 5,
    comment: 'Absolutely brilliant! A masterpiece of American literature.',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    bookId: '1',
    reviewerName: 'Bob Smith',
    rating: 4,
    comment: 'Great read, though the ending was a bit predictable.',
    createdAt: '2024-01-16T14:30:00Z',
    updatedAt: '2024-01-16T14:30:00Z'
  },
  {
    id: '3',
    bookId: '2',
    reviewerName: 'Carol Davis',
    rating: 5,
    comment: 'A powerful story that everyone should read.',
    createdAt: '2024-01-17T09:15:00Z',
    updatedAt: '2024-01-17T09:15:00Z'
  }
];

// RESTful API simulation with proper HTTP status codes
export class BookAPI {
  private static async simulateNetworkDelay(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
  }

  // GET /books - List all books with caching
  static async getBooks(): Promise<ApiResponse<Book[]>> {
    try {
      await this.simulateNetworkDelay();
      
      // Try cache first
      const cached = mockCache.get('books');
      if (cached) {
        console.log('📦 Cache hit: Retrieved books from cache');
        return {
          data: cached,
          message: 'Books retrieved from cache',
          status: 200
        };
      }

      console.log('💾 Cache miss: Fetching books from database');
      
      // Simulate potential cache service being down
      if (!mockCache.isOnline()) {
        console.warn('⚠️ Cache service is down, falling back to database');
      }

      // Simulate database query with indexing
      const books = [...mockBooks].sort((a, b) => a.title.localeCompare(b.title));
      
      // Populate cache (fails silently if cache is down)
      mockCache.set('books', books, 300);
      
      return {
        data: books,
        message: 'Books retrieved successfully',
        status: 200
      };
    } catch (error) {
      throw {
        message: 'Failed to retrieve books',
        status: 500,
        details: error instanceof Error ? error.message : 'Unknown error'
      } as ApiError;
    }
  }

  // POST /books - Add a new book
  static async createBook(bookData: CreateBookRequest): Promise<ApiResponse<Book>> {
    try {
      await this.simulateNetworkDelay();
      
      // Validation
      if (!bookData.title || !bookData.author) {
        throw {
          message: 'Title and author are required',
          status: 400
        } as ApiError;
      }

      // Check for duplicate ISBN
      const existingBook = mockBooks.find(book => book.isbn === bookData.isbn);
      if (existingBook) {
        throw {
          message: 'Book with this ISBN already exists',
          status: 409
        } as ApiError;
      }

      const newBook: Book = {
        id: (mockBooks.length + 1).toString(),
        ...bookData,
        averageRating: 0,
        totalReviews: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      mockBooks.push(newBook);
      
      // Invalidate cache
      mockCache.set('books', null, 0);
      
      return {
        data: newBook,
        message: 'Book created successfully',
        status: 201
      };
    } catch (error) {
      if (error && typeof error === 'object' && 'status' in error) {
        throw error;
      }
      throw {
        message: 'Failed to create book',
        status: 500,
        details: error instanceof Error ? error.message : 'Unknown error'
      } as ApiError;
    }
  }

  // GET /books/{id}/reviews - Get reviews for a book (with indexing simulation)
  static async getBookReviews(bookId: string): Promise<ApiResponse<Review[]>> {
    try {
      await this.simulateNetworkDelay();
      
      const book = mockBooks.find(b => b.id === bookId);
      if (!book) {
        throw {
          message: 'Book not found',
          status: 404
        } as ApiError;
      }

      // Simulate indexed query on bookId
      const reviews = mockReviews
        .filter(review => review.bookId === bookId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      return {
        data: reviews,
        message: 'Reviews retrieved successfully',
        status: 200
      };
    } catch (error) {
      if (error && typeof error === 'object' && 'status' in error) {
        throw error;
      }
      throw {
        message: 'Failed to retrieve reviews',
        status: 500,
        details: error instanceof Error ? error.message : 'Unknown error'
      } as ApiError;
    }
  }

  // POST /books/{id}/reviews - Add a review to a book
  static async createReview(bookId: string, reviewData: CreateReviewRequest): Promise<ApiResponse<Review>> {
    try {
      await this.simulateNetworkDelay();
      
      const book = mockBooks.find(b => b.id === bookId);
      if (!book) {
        throw {
          message: 'Book not found',
          status: 404
        } as ApiError;
      }

      // Validation
      if (!reviewData.reviewerName || reviewData.rating < 1 || reviewData.rating > 5) {
        throw {
          message: 'Invalid review data. Rating must be between 1-5 and reviewer name is required',
          status: 400
        } as ApiError;
      }

      const newReview: Review = {
        id: (mockReviews.length + 1).toString(),
        bookId,
        ...reviewData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      mockReviews.push(newReview);
      
      // Update book average rating and total reviews
      const bookReviews = mockReviews.filter(r => r.bookId === bookId);
      const avgRating = bookReviews.reduce((sum, r) => sum + r.rating, 0) / bookReviews.length;
      
      book.averageRating = Math.round(avgRating * 10) / 10;
      book.totalReviews = bookReviews.length;
      book.updatedAt = new Date().toISOString();
      
      return {
        data: newReview,
        message: 'Review created successfully',
        status: 201
      };
    } catch (error) {
      if (error && typeof error === 'object' && 'status' in error) {
        throw error;
      }
      throw {
        message: 'Failed to create review',
        status: 500,
        details: error instanceof Error ? error.message : 'Unknown error'
      } as ApiError;
    }
  }

  // Utility method to simulate cache being down for testing
  static simulateCacheDown(): void {
    mockCache.simulateDown();
  }
}
