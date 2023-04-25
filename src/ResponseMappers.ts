import { Movie } from './model/Movie';
import { MovieApiResponse } from './api/MovieApiResponse';
import { Paginated } from './model/Paginated';
import { Quote } from './model/Quote';
import { QuoteApiResponse } from './api/QuoteApiResponse';

export function toMovie(movie: MovieApiResponse): Movie {
  return {
    // API is using underscore dangle
    // eslint-disable-next-line no-underscore-dangle
    id: movie._id,
    name: movie.name,
    runtimeInMinutes: movie.runtimeInMinutes,
    budgetInMillions: movie.budgetInMillions,
    boxOfficeRevenueInMillions: movie.boxOfficeRevenueInMillions,
    academyAwardNominations: movie.academyAwardNominations,
    academyAwardWins: movie.academyAwardWins,
    rottenTomatoesScore: movie.rottenTomatoesScore,
  };
}

export function toMovies(data: Paginated<MovieApiResponse>) {
  return {
    ...data,
    docs: data.docs.map((movie) => toMovie(movie)),
  };
}

export function toQuotes(
  data: Paginated<QuoteApiResponse>,
  movies: Movie[] = []
): Paginated<Quote> {
  return {
    ...data,
    docs: data.docs.map((quote) => ({
      id: quote.id,
      dialog: quote.dialog,
      character: quote.character, // TODO: get the character as well
      movieId: quote.movie,
      movie: movies.find((movie) => movie?.id === quote.movie),
    })),
  };
}
