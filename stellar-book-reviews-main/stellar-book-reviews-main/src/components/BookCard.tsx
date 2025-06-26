
import { Book } from '@/types/book';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Calendar, User } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onClick: (book: Book) => void;
}

export const BookCard = ({ book, onClick }: BookCardProps) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) 
            ? 'fill-yellow-400 text-yellow-400' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <Card 
      className="cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 bg-gradient-to-br from-white to-gray-50 border-gray-200"
      onClick={() => onClick(book)}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg line-clamp-2 text-gray-800">{book.title}</CardTitle>
          <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200">
            {book.genre}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="w-4 h-4 text-blue-500" />
          <span>{book.author}</span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {book.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {renderStars(book.averageRating)}
            </div>
            <span className="text-sm font-medium text-blue-600">
              {book.averageRating.toFixed(1)}
            </span>
            <span className="text-xs text-muted-foreground">
              ({book.totalReviews} reviews)
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="w-3 h-3 text-purple-500" />
          <span>Published {book.publishedYear}</span>
        </div>
      </CardContent>
    </Card>
  );
};
