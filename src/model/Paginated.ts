export type Paginated<T> = {
  total: number;
  limit: number;
  offset: number;
  page: number;
  pages: number;
  docs: T[];
};
