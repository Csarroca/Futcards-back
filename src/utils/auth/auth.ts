import jwt from "jsonwebtoken";
import "../../loadEnvironment";
import bcrypt from "bcryptjs";
import { JwtPayload } from "../../types/interfaces";

export const hashCreator = (text: string) => {
  const salt = 10;
  return bcrypt.hash(text, salt);
};

export const hashCompare = (text: string, hash: string) =>
  bcrypt.compare(text, hash);

export const createToken = (payload: JwtPayload) =>
  jwt.sign(payload, process.env.SECRET);
