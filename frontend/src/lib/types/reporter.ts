export interface ReporterResponse {
  id: string;
  name: string;
  city: string;
  available: boolean;
  ratePerMin: number;
  createdAt: string;
  updatedAt: string;
}

export interface GetReportersParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'name' | 'city';
  sortOrder?: 'asc' | 'desc';
  available?: boolean;
}

export interface CreateReporterRequest {
  name: string;
  city: string;
  available?: boolean;
  ratePerMin?: number;
}

export interface UpdateReporterRequest {
  name?: string;
  city?: string;
  available?: boolean;
  ratePerMin?: number;
}