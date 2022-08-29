import { Request, Response, NextFunction } from "express";
import chalk from "chalk";
import Debug from "debug";
import { CustomError } from "../../types/interfaces";

const debug = Debug("robots:generalError");

const generalError = (
  error: CustomError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  const errorCode = error.statusCode ?? 500;
  const errorMessage = error.errorMessage ?? "something went wrong";

  debug(chalk.red(error.message));

  res.status(errorCode).json({ error: errorMessage });
};

export const notFoundError = (req: Request, res: Response) => {
  res.status(404).json({ error: "Enpoint not found" });
};
export default generalError;
