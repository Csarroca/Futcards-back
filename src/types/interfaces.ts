export interface UserData {
  id: string;
  userName: string;
  passwd: string;
}
export interface CustomError extends Error {
  statusCode: number;
  errorMessage: string;
}

export interface AuthData {
  userName: string;
  password: string;
}

export interface JwtPayload {
  id: string;
  userName: string;
}
