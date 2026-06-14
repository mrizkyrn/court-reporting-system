export interface EditorResponse {
  id: string;
  name: string;
  flatFee: number;
  createdAt: string;
  updatedAt: string;
}

export interface GetEditorsParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'name' | 'flatFee';
  sortOrder?: 'asc' | 'desc';
}

export interface CreateEditorRequest {
  name: string;
  flatFee?: number;
}

export interface UpdateEditorRequest {
  name?: string;
  flatFee?: number;
}