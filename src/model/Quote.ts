import { Movie } from "./Movie";

export type Quote = {
  id: string;
  dialog: string;
  movie?: Movie;
  movieId: string;
  character: string;
}
