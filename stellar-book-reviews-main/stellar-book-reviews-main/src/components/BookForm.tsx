
import { useState } from 'react';
import { CreateBookRequest } from '@/types/book';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateBook } from '@/hooks/useBooks';

interface BookFormProps {
  onSuccess?: () => void;
}

export const BookForm = ({ onSuccess }: BookFormProps) => {
  const [formData, setFormData] = useState<CreateBookRequest>({
    title: '',
    author: '',
    isbn: '',
    publishedYear: new Date().getFullYear(),
    genre: '',
    description: '',
  });

  const createBookMutation = useCreateBook();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createBookMutation.mutateAsync(formData);
      setFormData({
        title: '',
        author: '',
        isbn: '',
        publishedYear: new Date().getFullYear(),
        genre: '',
        description: '',
      });
      onSuccess?.();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleChange = (field: keyof CreateBookRequest, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Book</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="author">Author *</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => handleChange('author', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="isbn">ISBN</Label>
              <Input
                id="isbn"
                value={formData.isbn}
                onChange={(e) => handleChange('isbn', e.target.value)}
                placeholder="978-0-123456-78-9"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="publishedYear">Published Year</Label>
              <Input
                id="publishedYear"
                type="number"
                value={formData.publishedYear}
                onChange={(e) => handleChange('publishedYear', parseInt(e.target.value))}
                min="1000"
                max={new Date().getFullYear()}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="genre">Genre</Label>
            <Input
              id="genre"
              value={formData.genre}
              onChange={(e) => handleChange('genre', e.target.value)}
              placeholder="e.g., Science Fiction, Romance, Mystery"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Brief description of the book..."
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={createBookMutation.isPending}
          >
            {createBookMutation.isPending ? 'Creating...' : 'Add Book'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
