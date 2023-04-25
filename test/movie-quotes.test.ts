import fetchMock from 'fetch-mock';
import * as fs from 'fs';
import assert from 'assert';
import TheOneApi from '../src/TheOneApi';
import assertIsMovie from './helpers/assertIsMovie';

describe('movie quotes', async () => {
  const api = TheOneApi.create({ apiKey: 'test-token' });

  afterEach(() => {
    fetchMock.restore();
  });

  const rotkId = '5cd95395de30eff6ebccde5d';

  it('should be able to fetch quotes from a specific movie', async () => {
    fetchMock.mock(
      `https://the-one-api.dev/v2/movie/${rotkId}/quote`,
      JSON.parse(fs.readFileSync('./test/data/movie-quotes.json').toString())
    );

    fetchMock.mock(
      `https://the-one-api.dev/v2/movie/${rotkId}`,
      JSON.parse(fs.readFileSync('./test/data/movie-rotk.json').toString())
    );

    const quotes = await api.getQuotesFromMovie(rotkId);

    assert.ok(quotes.limit !== undefined);
    assert.ok(quotes.page !== undefined);
    assert.ok(quotes.pages !== undefined);
    assert.ok(quotes.offset !== undefined);
    assert.ok(quotes.total !== undefined);

    quotes.docs.forEach((quote) => {
      assert.ok(quote.id !== undefined && quote.id.length > 0);
      assert.ok(quote.dialog !== undefined && quote.dialog.length > 0);
      assert.ok(quote.character !== undefined && quote.character.length > 0);
      assert.ok(quote.movie !== undefined);
      assertIsMovie(quote.movie);
      assert.strictEqual(quote.movieId, rotkId);
    });
  });
});
