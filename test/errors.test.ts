import fetchMock from 'fetch-mock';
import * as assert from 'assert';
import TheOneApi from '../src/TheOneApi';
import ApiError from '../src/ApiError';

describe('api errors', async () => {
  const api = TheOneApi.create({ apiKey: 'test-token' });

  afterEach(() => {
    fetchMock.restore();
  });

  [401, 403, 500, 501, 503].forEach((statusCode) => {
    it(`when the api return ${statusCode} and ApiError with ${statusCode} code should be thrown`, async () => {
      fetchMock.mock('https://the-one-api.dev/v2/movie/some-id', {
        status: statusCode,
        body: JSON.stringify({
          message: `${statusCode}`,
        }),
      });

      try {
        await api.getMovie('some-id');
      } catch (e) {
        if (e instanceof ApiError) {
          assert.strictEqual(e.status, statusCode);
        } else {
          throw e;
        }
      }
    });
  });

  it('when the api returns invalid json an error should be thrown', async () => {
    fetchMock.mock('https://the-one-api.dev/v2/movie/some-id', {
      status: 200,
      body: 'invalid json',
    });

    try {
      await api.getMovie('some-id');
    } catch (e) {
      return;
    }
    assert.fail('should have thrown error');
  });

  it('when the api returns 500 error an error should be thrown', async () => {
    fetchMock.mock('https://the-one-api.dev/v2/movie/some-id', {
      status: 500,
      body: JSON.stringify({ message: 'oops, something went wrong' }),
    });

    try {
      await api.getMovie('some-id');
    } catch (e) {
      if (e instanceof ApiError) {
        assert.strictEqual(e.status, 500);
        assert.strictEqual(e.message, 'oops, something went wrong');
      } else {
        throw e;
      }
    }
  });
});
