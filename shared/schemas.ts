import { z } from "zod";

export const MovieSchema = z.object({
  id: z.number(),
  title: z.string(),
  poster_path: z.string().nullable(), 
  popularity: z.number(),
});

export const MoviesResponseSchema = z.object({
  page: z.number(),
  results: z.array(MovieSchema), 
  total_pages: z.number(),
  total_results: z.number(),
});

export const GenreSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const MovieDetailsSchema = z.object({
  id: z.number(),
  title: z.string(),
  overview: z.string(),
  poster_path: z.string().nullable(),
  backdrop_path: z.string().nullable(),
  release_date: z.string(),
  runtime: z.number().nullable(),
  vote_average: z.number(),
  vote_count: z.number(),
  genres: z.array(GenreSchema),
  popularity: z.number(),
  tagline: z.string().nullable(),
});

export type Movie = z.infer<typeof MovieSchema>;
export type MoviesResponse = z.infer<typeof MoviesResponseSchema>;
export type Genre = z.infer<typeof GenreSchema>;
export type MovieDetails = z.infer<typeof MovieDetailsSchema>;
