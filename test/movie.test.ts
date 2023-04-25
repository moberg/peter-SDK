import fetchMock from 'fetch-mock';
import * as fs from 'fs';
import * as assert from 'assert';
import TheOneApi from '../src/TheOneApi';
import { ApiError } from '../src/ApiError';
import assertIsMovie from './helpers/assertIsMovie';

describe('movie', async () => {
  const api = TheOneApi.create({ apiKey: 'test-token' });

  afterEach(() => {
    fetchMock.restore();
  });

  it('should be able fetch a single movie', async () => {
    fetchMock.mock(
      'https://the-one-api.dev/v2/movie/some-id',
      JSON.parse(fs.readFileSync('./test/data/movie.json').toString())
    );

    const movie = await api.getMovie('some-id');
    assertIsMovie(movie);
  });

  it('when a movie is not found the SDK should throw ApiError with 404 code', async () => {
    fetchMock.mock('https://the-one-api.dev/v2/movie/some-id-that-does-not-exist', {
      docs: [],
      total: 0,
      limit: 1000,
      offset: 0,
      page: 1,
      pages: 1,
    });

    try {
      await api.getMovie('some-id-that-does-not-exist');
    } catch (e) {
      if (e instanceof ApiError) {
        assert.strictEqual(e.status, 404);
      } else {
        throw e;
      }
    }
  });
});
