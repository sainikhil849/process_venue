
import { useState } from 'react';
import { CreateReviewRequest } from '@/types/book';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { useCreateReview } from '@/hooks/useReviews';

interface ReviewFormProps {
  bookId: string;
  bookTitle: string;
  onSuccess?: () => void;
}

export const ReviewForm = ({ bookId, bookTitle, onSuccess }: ReviewFormProps) => {
  const [formData, setFormData] = useState<CreateReviewRequest>({
    reviewerName: '',
    rating: 5,
    comment: '',
  });

  const createReviewMutation = useCreateReview(bookId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createReviewMutation.mutateAsync(formData);
      setFormData({
        reviewerName: '',
        rating: 5,
        comment: '',
      });
      onSuccess?.();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const renderStarRating = () => {
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`w-6 h-6 cursor-pointer transition-colors ${
              i < formData.rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300 hover:text-yellow-300'
            }`}
            onClick={() => setFormData(prev => ({ ...prev, rating: i + 1 }))}
          />
        ))}
        <span className="ml-2 text-sm text-muted-foreground">
          {formData.rating} star{formData.rating !== 1 ? 's' : ''}
        </span>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Write a Review for "{bookTitle}"</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reviewerName">Your Name *</Label>
            <Input
              id="reviewerName"
              value={formData.reviewerName}
              onChange={(e) => setFormData(prev => ({ ...prev, reviewerName: e.target.value }))}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Rating *</Label>
            {renderStarRating()}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="comment">Comment</Label>
            <textarea
              id="comment"
              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.comment}
              onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
              placeholder="Share your thoughts about this book..."
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={createReviewMutation.isPending}
          >
            {createReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
