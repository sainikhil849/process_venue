
import { useState } from 'react';
import { Book } from '@/types/book';
import { BookCard } from '@/components/BookCard';
import { BookForm } from '@/components/BookForm';
import { ReviewForm } from '@/components/ReviewForm';
import { ReviewList } from '@/components/ReviewList';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useBooks } from '@/hooks/useBooks';
import { BookAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Plus, Search, AlertTriangle, Database } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddBook, setShowAddBook] = useState(false);
  const [isCacheDown, setIsCacheDown] = useState(false);

  const { data: books, isLoading, error, refetch } = useBooks();

  const filteredBooks = books?.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.genre.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleBookClick = (book: Book) => {
    console.log('Book selected:', book.title);
    setSelectedBook(book);
  };

  const handleCacheTest = async () => {
    console.log('Testing cache functionality...');
    setIsCacheDown(true);
    
    try {
      // Simulate cache service testing
      BookAPI.simulateCacheDown();
      
      toast({
        title: "Cache Test Started",
        description: "Testing cache service functionality...",
        variant: "destructive",
      });
      
      console.log('Cache service temporarily disabled for testing');
      
      // Simulate cache restoration after 3 seconds
      setTimeout(async () => {
        setIsCacheDown(false);
        toast({
          title: "Cache Test Complete",
          description: "Cache service is operational",
        });
        console.log('Cache service restored and functional');
        
        // Refetch data to test cache functionality
        await refetch();
      }, 3000);
    } catch (error) {
      console.error('Cache test failed:', error);
      setIsCacheDown(false);
      toast({
        title: "Cache Test Failed",
        description: "Unable to test cache functionality",
        variant: "destructive",
      });
    }
  };

  if (error) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle className="text-red-600">Unable to Load Books</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                There was an issue retrieving the book collection. Please check your connection and try again.
              </p>
              <Button onClick={() => refetch()} className="w-full">
                Retry Loading
              </Button>
            </CardContent>
          </Card>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    BookReview
                  </h1>
                  <p className="text-sm text-muted-foreground">Professional Book Review Platform</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCacheTest}
                  disabled={isCacheDown}
                  className="text-xs hover:bg-blue-50"
                >
                  <Database className="w-4 h-4 mr-1" />
                  {isCacheDown ? 'Testing...' : 'Test Cache'}
                </Button>
                
                <Dialog open={showAddBook} onOpenChange={setShowAddBook}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Book
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New Book</DialogTitle>
                    </DialogHeader>
                    <BookForm onSuccess={() => setShowAddBook(false)} />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {selectedBook ? (
            /* Book Detail View */
            <div className="space-y-6">
              <Button
                variant="outline"
                onClick={() => setSelectedBook(null)}
                className="mb-4 hover:bg-blue-50"
              >
                ← Back to Books
              </Button>
              
              <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <CardTitle className="text-2xl">{selectedBook.title}</CardTitle>
                      <p className="text-lg text-muted-foreground">by {selectedBook.author}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Published: {selectedBook.publishedYear}</span>
                        <span>Genre: {selectedBook.genre}</span>
                        <span>ISBN: {selectedBook.isbn}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">{selectedBook.averageRating.toFixed(1)}</div>
                      <div className="text-sm text-muted-foreground">
                        {selectedBook.totalReviews} reviews
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground mb-6 leading-relaxed">{selectedBook.description}</p>
                  
                  <Tabs defaultValue="reviews" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="reviews">Reviews</TabsTrigger>
                      <TabsTrigger value="add-review">Write Review</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="reviews" className="mt-6">
                      <ReviewList bookId={selectedBook.id} />
                    </TabsContent>
                    
                    <TabsContent value="add-review" className="mt-6">
                      <ReviewForm
                        bookId={selectedBook.id}
                        bookTitle={selectedBook.title}
                        onSuccess={() => {}}
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Books List View */
            <div className="space-y-6">
              {/* Search */}
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search books, authors, or genres..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              {/* Books Grid */}
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }, (_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardHeader className="space-y-3">
                        <div className="h-6 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredBooks.length === 0 ? (
                <Card className="shadow-lg">
                  <CardContent className="py-12 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      {searchTerm ? 'No books found' : 'Start Your Library'}
                    </h3>
                    <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                      {searchTerm 
                        ? `No books match "${searchTerm}". Try a different search term or browse all books.`
                        : 'Begin building your personal book collection by adding your first book!'
                      }
                    </p>
                    {!searchTerm && (
                      <Dialog open={showAddBook} onOpenChange={setShowAddBook}>
                        <DialogTrigger asChild>
                          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Your First Book
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Add New Book</DialogTitle>
                          </DialogHeader>
                          <BookForm onSuccess={() => setShowAddBook(false)} />
                        </DialogContent>
                      </Dialog>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBooks.map((book) => (
                    <BookCard
                      key={book.id}
                      book={book}
                      onClick={handleBookClick}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default Index;
