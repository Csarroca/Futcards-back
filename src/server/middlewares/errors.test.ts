import { Request, Response, NextFunction } from "express";
import generalError, { notFoundError } from "./errors";
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
  describe("When it's called with a custom error but undefined parameters", () => {
    test("Then it should call res.status with a default status of '500'", () => {
      const req = {} as Partial<Request>;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;
      const next = jest.fn();

      const customError = createCustomError(undefined, "", "");
      generalError(
        customError,
        req as Request,
        res as Response,
        next as NextFunction
      );
      const expectedStatus = 500;

      generalError(customError, req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });
  });
});

describe("Given a notFoundError function", () => {
  describe("When it´s called with  a responose and a request", () => {
    const req = {} as Partial<Request>;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;
    test("Then it should call the status method with 404 as status code", async () => {
      const statusCode = 404;
      notFoundError(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(statusCode);
    });

    test("The it should call the json method with an error", async () => {
      const error = { error: "Endpoint not found" };

      notFoundError(req as Request, res as Response);

      expect(res.json).toHaveBeenCalledWith(error);
    });
  });
});
