import { NextFunction, Response } from "express";
import createCustomError from "../../utils/createCustomError/createCustomError";

import authentication, { CustomRequest } from "./authentication";

describe("Given a authentication middleware", () => {
  const getTestConfiguration = (errorType: string) => {
    const mockReturn = jest.fn().mockReturnValue(errorType);
    const req = { get: mockReturn } as Partial<CustomRequest>;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;
    const next = jest.fn() as Partial<NextFunction>;
    authentication(req as CustomRequest, res as Response, next as NextFunction);
    return next;
  };

  describe("When called", () => {
    test("It should send an error when there is no Authentication header", () => {
      const next = getTestConfiguration("badRequest");
      const customError = createCustomError(404, "Authentication error");

      expect(next).toHaveBeenCalledWith(customError);
    });

    test("It should send an error or when the Authentication doesn't start with bearer", () => {
      const next = getTestConfiguration("Bearer fakeToken");

      const customError = createCustomError(404, "Unable to verify token");

      expect(next).toHaveBeenCalledWith(customError);
    });
  });
});
