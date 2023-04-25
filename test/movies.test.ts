import fetchMock from 'fetch-mock';
import * as fs from 'fs';
import * as assert from 'assert';
import TheOneApi from '../src/TheOneApi';
import assertIsMovie from './helpers/assertIsMovie';

describe('movies', async () => {
  const api = TheOneApi.create({ apiKey: 'test-token' });

  afterEach(() => {
    fetchMock.restore();
  });

  it('should be able to fetch a list of movies', async () => {
    fetchMock.mock(
      'https://the-one-api.dev/v2/movie?limit=1000',
      JSON.parse(fs.readFileSync('./test/data/movies.json').toString())
    );

    const movies = await api.getMovies({ limit: 1000 });

    assert.strictEqual(movies.total, 8);
    assert.strictEqual(movies.limit, 1000);
    assert.strictEqual(movies.page, 1);
    assert.strictEqual(movies.pages, 1);

    movies.docs.forEach((movie) => assertIsMovie(movie));
  });

  it('should include limit and offset in the query string when providing pagination', async () => {
    fetchMock.mock(
      'https://the-one-api.dev/v2/movie?limit=22&offset=33',
      JSON.parse(fs.readFileSync('./test/data/movies.json').toString())
    );

    const movies = await api.getMovies({ limit: 22, offset: 33 });
  });
});
