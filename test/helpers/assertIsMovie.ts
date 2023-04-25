import assert from "assert";
import { Movie } from "../../src/model/Movie";

export default function assertIsMovie(movie: Movie) {
  assert.ok(movie.id !== undefined && movie.id.length > 0);
  assert.ok(movie.name !== undefined && movie.name.length > 0);
  assert.ok(movie.runtimeInMinutes !== undefined && movie.runtimeInMinutes > 0);
  assert.ok(movie.budgetInMillions !== undefined && movie.budgetInMillions > 0);
  assert.ok(movie.boxOfficeRevenueInMillions !== undefined && movie.boxOfficeRevenueInMillions > 0);
  assert.ok(movie.boxOfficeRevenueInMillions !== undefined && movie.boxOfficeRevenueInMillions > 0);
  assert.ok(movie.academyAwardNominations !== undefined && movie.academyAwardNominations > 0);
  assert.ok(movie.academyAwardWins !== undefined && movie.academyAwardWins >= 0);
  assert.ok(movie.rottenTomatoesScore !== undefined && movie.rottenTomatoesScore > 0);
}
