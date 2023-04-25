import fetchMock from 'fetch-mock';
import * as fs from 'fs';
import * as assert from 'assert';
import TheOneApi from '../src/TheOneApi';

describe('quote', async () => {
  const api = TheOneApi.create({ apiKey: 'test-token' });

  afterEach(() => {
    fetchMock.restore();
  });

  it('should be able fetch a list of quotes including the movies', async () => {
    fetchMock.mock(
      'https://the-one-api.dev/v2/quote',
      JSON.parse(fs.readFileSync('./test/data/quote-1.json').toString())
    );

    fetchMock.mock(
      'https://the-one-api.dev/v2/movie/5cd95395de30eff6ebccde5d',
      JSON.parse(fs.readFileSync('./test/data/movie-rotk.json').toString())
    );

    const quotes = await api.getQuotes();

    assert.deepStrictEqual(quotes, {
      docs: [
        {
          character: '5cd99d4bde30eff6ebccfe9e',
          dialog: 'Deagol!',
          id: '5cd96e05de30eff6ebcce7e9',
          movieId: '5cd95395de30eff6ebccde5d',
          movie: {
            // The movie has been automatically resolved
            academyAwardNominations: 11,
            academyAwardWins: 11,
            boxOfficeRevenueInMillions: 1120,
            budgetInMillions: 94,
            id: '5cd95395de30eff6ebccde5d',
            name: 'The Return of the King',
            rottenTomatoesScore: 95,
            runtimeInMinutes: 201,
          },
        },
      ],
      limit: 1,
      offset: 0,
      page: 1,
      pages: 120,
      total: 2384,
    });
  });

  it('when a quote references a movie that is not found the movie should be returned as undefined', async () => {
    fetchMock.mock(
      'https://the-one-api.dev/v2/quote',
      JSON.parse(fs.readFileSync('./test/data/quote-1.json').toString())
    );

    fetchMock.mock('https://the-one-api.dev/v2/movie/5cd95395de30eff6ebccde5d', {
      docs: [],
      total: 0,
      limit: 1000,
      offset: 0,
      page: 1,
      pages: 1,
    });

    const quotes = await api.getQuotes();

    assert.deepStrictEqual(quotes, {
      docs: [
        {
          character: '5cd99d4bde30eff6ebccfe9e',
          dialog: 'Deagol!',
          id: '5cd96e05de30eff6ebcce7e9',
          movie: undefined,
          movieId: '5cd95395de30eff6ebccde5d',
        },
      ],
      limit: 1,
      offset: 0,
      page: 1,
      pages: 120,
      total: 2384,
    });
  });
});
