// API and service-related types

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface QueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
  filters?: Record<string, unknown>;
}

// Service operation results
export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Loading states for async operations
export interface LoadingState {
  loading: boolean;
  error: string | null;
}

export interface AsyncState<T> extends LoadingState {
  data: T | null;
}

// Firebase-specific types
export interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
}

export interface FirebaseError {
  code: string;
  message: string;
  name: string;
}
