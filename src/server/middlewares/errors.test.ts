import { Request, Response, NextFunction } from "express";
import generalError from "./errors";
import createCustomError from "../../utils/createCustomError";

describe("Given a generalError function", () => {
  describe("When called with a CustomError as arguments", () => {
    const customError = createCustomError(404, "private error", "public error");
    const req = {} as Partial<Request>;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;
    const next = jest.fn();

    generalError(
      customError,
      req as Request,
      res as Response,
      next as NextFunction
    );
    test("It should call the status method with the value received from the CustomError property 'statucCode'", () => {
      const status = 404;

      expect(res.status).toBeCalledWith(status);
    });

    test("It should call the json method with the value received from the customError property 'errorMessage'", () => {
      const error = { error: customError.errorMessage };

      expect(res.json).toBeCalledWith(error);
    });
  });
});
