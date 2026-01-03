export interface ResponseWithMetadata<T> {
  meta?: {
    total: number;
    page: number;
    per_page: number;
  };
  data: T;
  success?: boolean;
}
