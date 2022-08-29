export interface UserData {
  id: string;
  userName: string;
  passwd: string;
}
export interface CustomError extends Error {
  statusCode: number;
  errorMessage: string;
}
