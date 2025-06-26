
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Review, CreateReviewRequest, ApiError } from '@/types/book';
import { BookAPI } from '@/services/api';
import { toast } from '@/hooks/use-toast';

export const useReviews = (bookId: string) => {
  return useQuery({
    queryKey: ['reviews', bookId],
    queryFn: async () => {
      try {
        const response = await BookAPI.getBookReviews(bookId);
        return response.data;
      } catch (error) {
        const apiError = error as ApiError;
        toast({
          title: "Error",
          description: apiError.message,
          variant: "destructive",
        });
        throw error;
      }
    },
    enabled: !!bookId,
  });
};

export const useCreateReview = (bookId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (reviewData: CreateReviewRequest) => {
      const response = await BookAPI.createReview(bookId, reviewData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', bookId] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast({
        title: "Success",
        description: "Review added successfully!",
      });
    },
    onError: (error: ApiError) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
