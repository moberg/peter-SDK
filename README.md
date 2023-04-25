# The One SDK

Typescript SDK for The One API (https://the-one-api.dev/).

# Installation

Install `the-one-api-sdk` using your package manager of choice:

`npm install the-one-api-sdk --save`

`yarn add the-one-api-sdk`

## Usage

Basic usage:

```typescript

import TheOneApi from "the-one-api-sdk";

const api = TheOneApi.create({ apiKey: 'your-api-key' });

console.log('Movies in the series: ');
const movies = await api.getMovies();
movies.docs.forEach((movie) => {
  console.log(`${movie.name} (id: ${movie.id})`);
});

```

## Tests

Run the tests in the project `npm run test`

