import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  MovieDetails,
  MovieDetailsSchema,
  MoviesResponse,
  MoviesResponseSchema,
} from "../schemas";
import { apiClient } from "./api";

async function fetchPopularMovies(page: number): Promise<MoviesResponse> {
  const response = await apiClient.get("/movie/popular", {
    params: { page },
  });
  return MoviesResponseSchema.parse(response.data);
}

export function usePopularMovies() {
  return useInfiniteQuery({
    queryKey: ["movies", "popular"], 
    queryFn: ({ pageParam = 1 }) => fetchPopularMovies(pageParam), 
    initialPageParam: 1, 
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
  });
}

async function fetchMovieDetails(movieId: number): Promise<MovieDetails> {
  const response = await apiClient.get(`/movie/${movieId}`);
  return MovieDetailsSchema.parse(response.data);
}

export function useMovieDetails(movieId: number) {
  return useQuery({
    queryKey: ["movie", movieId], 
    queryFn: () => fetchMovieDetails(movieId),
    enabled: !!movieId, 
  });
}
