import { Request, Response, NextFunction } from "express";
import chalk from "chalk";
import Debug from "debug";
import { ValidationError } from "express-validation";
import { CustomError } from "../../types/interfaces";

const debug = Debug("futCards:generalError");

const generalError = (
  error: CustomError | ValidationError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  let errorCode;
  let errorMessage;
  if (error instanceof ValidationError) {
    debug(chalk.red("Request validation errors: "));
    error.details.body.forEach((errorInfo) => {
      debug(chalk.red(errorInfo.message));
    });

    errorCode = error.statusCode;
    errorMessage = "Wrong data";
  } else {
    errorCode = error.statusCode ?? 500;
    errorMessage = error.errorMessage || "something went wrong";

    debug(chalk.red(error.message));
  }
  res.status(errorCode).json({ error: errorMessage });
};

export const notFoundError = (req: Request, res: Response) => {
  res.status(404).json({ error: "Endpoint not found" });
};
export default generalError;
