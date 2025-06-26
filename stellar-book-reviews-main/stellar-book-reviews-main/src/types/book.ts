
export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  publishedYear: number;
  genre: string;
  description: string;
  coverImage?: string;
  averageRating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  bookId: string;
  reviewerName: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookRequest {
  title: string;
  author: string;
  isbn: string;
  publishedYear: number;
  genre: string;
  description: string;
  coverImage?: string;
}

export interface CreateReviewRequest {
  reviewerName: string;
  rating: number;
  comment: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}

export interface ApiError {
  message: string;
  status: number;
  details?: string;
}
