export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
}
