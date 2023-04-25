# SDK Design

The SDK is built to be small, with minimal external dependencies. Having a small SDK
with is important since it makes it easier for devs to include it into their projects (less risk of dependency
collision), reduces their footprint and is better from a security standpoint (less libraries that may need
security updates).

Code structure:

- `src/TheOneApi.ts` - The public API.
- `src/api/*` - Type definitions for the raw responses from the API.
- `src/model/*` - SDK representation of the objects returned from the API. The response have been modified slightly to
  improve consitancy of the API and make the SDK easier to yser.
- `src/ResponseMappers.ts` - Transforms raw API responses into the SDK model.
- `test/` - Tests

## Future improvements

Due to the time limitation of this project, some features that you would like in an API SDK were left out.

### Retry and exponential back-off

This is an essential feature of a SDK. I would add options to control the default timeouts and also override it on a per
method basis. Also the number of retries should be configurable with an exponential back-off.

### Replacing native fetch

I would replace the native `fetch` used in the project with cross-fetch or another alternative with better
compatability.

### Bundling & publishing

I would use webpack or another bundler to bundle the build into one file. Minimize it. Remove files that should not be
published to NPM such as the example and unit tests. 
