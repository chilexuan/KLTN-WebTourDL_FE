export interface User {
  id: number;
  username: string;
  email: string;
  role: string; // 'admin' hoặc 'user'
  created_at?: string;
  updated_at?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
}

export interface UpdateUserDto {
  email?: string;
  role?: string;
  password?: string;
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  role: string;
}

export interface MessageResponse {
  message: string;
}