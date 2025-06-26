
import { Review } from '@/types/book';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Star, User, Calendar } from 'lucide-react';
import { useReviews } from '@/hooks/useReviews';

interface ReviewListProps {
  bookId: string;
}

export const ReviewList = ({ bookId }: ReviewListProps) => {
  const { data: reviews, isLoading, error } = useReviews(bookId);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating 
            ? 'fill-yellow-400 text-yellow-400' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Reviews</h3>
        <div className="space-y-3">
          {Array.from({ length: 3 }, (_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-3">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Reviews</h3>
        <Card className="border-red-200">
          <CardContent className="pt-6">
            <p className="text-red-600">Failed to load reviews. Please try again later.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">
        Reviews ({reviews?.length || 0})
      </h3>
      
      {!reviews || reviews.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center">
              No reviews yet. Be the first to review this book!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{review.reviewerName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {review.rating}/5
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(review.createdAt)}</span>
                </div>
              </CardHeader>
              
              {review.comment && (
                <CardContent>
                  <p className="text-sm">{review.comment}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
