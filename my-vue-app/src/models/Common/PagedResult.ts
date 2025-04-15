export interface PagedResult<T> {
    items: T[]; 
    totalCount: number;
    pageNumber: number;
    pageSize: number;   
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}