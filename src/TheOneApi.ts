import { Movie } from './model/Movie';
import { Paginated } from './model/Paginated';
import { MovieApiResponse } from './api/MovieApiResponse';
import { toMovie, toMovies, toQuotes } from './ResponseMappers';
import { QuoteApiResponse } from './api/QuoteApiResponse';
import { Quote } from './model/Quote';
import { ApiError } from './ApiError';
import { PaginationOpts } from './model/PaginationOpts';

const API_BASE_URL = 'https://the-one-api.dev/v2';

type ApiOpts = {
  apiKey: string;
};

export default class TheOneApi {
  private readonly apiKey: string;

  private constructor({ apiKey }: Partial<ApiOpts>) {
    // Currently only api calls that require a key are implemented
    // some APIs might not require the key, so in the future it might
    // not be required.
    if (!apiKey) {
      throw new Error('You need to provide an API key');
    }

    this.apiKey = apiKey;
  }

  /**
   * Create an instance of TheOneApi.
   * @param  {String} [opts.apiToken]  API token from the-one-api.dev. Please get it from your account.
   * @return {TheOneApi}
   */
  static create(opts: Partial<ApiOpts>) {
    return new TheOneApi(opts);
  }

  /**
   * Gets a movie by id
   * @param  {String} id ID of the movie to get
   * @return {Promise<Movie>}
   */
  public async getMovie(id: string): Promise<Movie> {
    const data = await this.get<Paginated<MovieApiResponse>>(`/movie/${id}`);

    // The API returns an empty list when the movie is not found, a better
    // response would have been a 404. The SDK will treat this as 404.
    if (data.docs.length === 0) {
      throw new ApiError('Not found', 404);
    }

    // Return quotes in SDK format
    return toMovie(data.docs[0]);
  }

  /**
   * Get the movies in the LOTR series
   * @param  {String} [opts.offset] Optional offset when paginating results
   * @param  {String} [opts.limit] Optional limit when paginating results
   * @return {Promise<Paginated<Movie>>}
   */
  public async getMovies(opts?: PaginationOpts): Promise<Paginated<Movie>> {
    const data = await this.get<Paginated<MovieApiResponse>>('/movie', opts);

    // Transform into SDK model
    return toMovies(data);
  }

  /**
   * Get Gets quotes from LOTR
   * @param  {String} [opts.offset] Optional offset when paginating results
   * @param  {String} [opts.limit] Optional limit when paginating results
   * @return {Promise<Paginated<Movie>>}
   */
  public async getQuotes(opts?: PaginationOpts): Promise<Paginated<Quote>> {
    const quoteApiResponse = await this.get<Paginated<QuoteApiResponse>>('/quote', opts);

    // Get a unique list of movie ids
    const movieIds = Array.from(new Set(quoteApiResponse.docs.map((quote) => quote.movie)));

    // Fetch the movies
    const moviesResponse = await Promise.allSettled(
      movieIds.map((movieId) => this.getMovie(movieId))
    );

    // Filter out the ones we didn't find from the response
    const movies = moviesResponse.reduce((acc, movie) => {
      if (movie.status === 'fulfilled') {
        acc.push(movie.value);
      }
      return acc;
    }, [] as Movie[]);

    // Return quotes in SDK format
    return toQuotes(quoteApiResponse, movies);
  }

  /**
   * Gets quotes from a specific movie
   * @param  {String} movieId         ID of the movie to fetch quotes from
   * @param  {String} [opts.offset]   Optional offset when paginating results
   * @param  {String} [opts.limit]    Optional limit when paginating results
   * @return {Promise<Paginated<Quote>>}
   */
  public async getQuotesFromMovie(
    movieId: string,
    opts?: PaginationOpts
  ): Promise<Paginated<Quote>> {
    const [quoteApiResponse, movie] = await Promise.all([
      this.get<Paginated<QuoteApiResponse>>(`/movie/${movieId}/quote`, opts),
      this.getMovie(movieId),
    ]);

    return toQuotes(quoteApiResponse, [movie]);
  }

  /**
   *  Private http request helper function. In a bigger project, where the API
   *  needs to be split up in multiple files, I would move this into a shared
   *  class that can be reused.
   */
  private async get<T>(url: string, opts: PaginationOpts | undefined = undefined) {
    let queryParams = '';

    // Create query string
    if (opts) {
      const paginationOpts: { [key: string]: string } = {};
      Object.entries(opts).forEach(([key, value]) => {
        paginationOpts[key] = String(value);
      });
      queryParams = `?${new URLSearchParams(paginationOpts).toString()}`;
    }

    // Make request
    const res = await fetch(`${API_BASE_URL}${url}${queryParams}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
    });

    // Handle errors
    if (res.status >= 400) {
      // If we got an error, try to parse the body
      let errorBody = { message: 'Error' };
      try {
        errorBody = await res.json();
      } catch (e) {
        // We couldn't parse the response, nothing to do
      }
      throw new ApiError(errorBody.message, res.status);
    }

    // All good, try to convert response to JSON
    return (await res.json()) as T;
  }
}
