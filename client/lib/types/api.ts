export interface AuthResponse {
  token: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  name: string;
  profile_picture: string;
  tfa_state: string;
  is_email_verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Vault {
  id: string;
  identifier: string;
  encrypted_payload: string;
  website_name: string;
  website_url?: string;
  category?: Category;
  createdAt: string;
  updatedAt: string;
}

export interface AuthLog {
  id: string;
  userId: string;
  device: string;
  location: string;
  ip: string;
  status: "success" | "failed";
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
