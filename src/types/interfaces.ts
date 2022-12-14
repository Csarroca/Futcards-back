export interface UserData {
  id: string;
  userName: string;
  password: string;
}
export interface CustomError extends Error {
  statusCode: number;
  errorMessage: string;
  privateMessage: string;
}

export interface AuthData {
  userName: string;
  password: string;
}

export interface JwtPayload {
  id: string;
  userName: string;
}

export interface CardData {
  id: string;
  name: string;
  image: string;
  position: string;
  nacionallity: string;
  team: string;
  overall: number;
  physicall: number;
  pace: number;
  passing: number;
  defense: number;
  shooting: number;
  dribbling: number;
  height: number;
  age: number;
  foot: string;
  owner: string;
  backupImage?: string;
}

export interface ProtoCardData {
  name: string;
  image?: string;
  position: string;
  nacionallity: string;
  team: string;
  overall: number;
  physicall: number;
  pace: number;
  passing: number;
  defense: number;
  shooting: number;
  dribbling: number;
  height: number;
  age: number;
  foot: string;
  owner: string;
}
