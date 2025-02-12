export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    offset : number;
    totalPages: number;
}