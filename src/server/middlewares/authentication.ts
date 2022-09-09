import { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import chalk from "chalk";
import Debug from "debug";
import createCustomError from "../../utils/createCustomError/createCustomError";
import { verifyToken } from "../../utils/auth/auth";

const debug = Debug("cards:authenticaton");

export interface CustomRequest extends Request {
  payload: JwtPayload;
}

const authentication = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const customError = createCustomError(400, "Authentication error");
  const dataAuthentication = req.get("Authorization");

  debug(chalk.bgBlue(req));
  if (!dataAuthentication || !dataAuthentication.startsWith("Bearer ")) {
    next(customError);
    return;
  }
  const token = dataAuthentication.slice(7);
  let tokenData: JwtPayload | string;
  try {
    tokenData = verifyToken(token);
  } catch {
    const authError = createCustomError(401, "Unable to verify token");
    next(authError);
    return;
  }

  req.payload = tokenData as JwtPayload;
  next();
};

export default authentication;
