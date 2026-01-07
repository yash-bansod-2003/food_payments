export interface ResponseWithMetadata<T> {
  meta?: {
    total: number;
    page: number;
    perPage: number;
  };
  data: T;
  success?: boolean;
}
