
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Book, CreateBookRequest, ApiError } from '@/types/book';
import { BookAPI } from '@/services/api';
import { toast } from '@/hooks/use-toast';

export const useBooks = () => {
  return useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      try {
        const response = await BookAPI.getBooks();
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
  });
};

export const useCreateBook = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (bookData: CreateBookRequest) => {
      const response = await BookAPI.createBook(bookData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast({
        title: "Success",
        description: "Book created successfully!",
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
