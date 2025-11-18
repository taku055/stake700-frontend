export type tPaginationResult<T, SummarizedType = any> = {
  total: number;
  data: T[];
  summarized?: SummarizedType;
};
