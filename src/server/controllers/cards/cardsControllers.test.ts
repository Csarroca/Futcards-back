import { NextFunction, Request, Response } from "express";
import Card from "../../../dataBase/models/cards";
import createCustomError from "../../../utils/createCustomError/createCustomError";
import getAllCards from "./cardsControllers";

describe("Given a getAllCards function", () => {
  const req = {} as Partial<Request>;
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as Partial<Response>;
  const next = jest.fn() as NextFunction;
  Card.find = jest.fn().mockReturnValue([mockProject]);

  describe("When called with a request, a response and a next function", () => {
    test("Then it should respond with a status of 201", async () => {
      const expectedStatus = 201;

      await getAllCards(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });

    test(`Then it should respond with all the projects found`, async () => {
      const expectedResponse = {
        projects: [mockProject],
      };
      await getAllCards(req as Request, res as Response, next);

      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });
  });

  describe("When called but the database doesn't return any valid data", () => {
    test("Then it should call next with an error", async () => {
      Card.find = jest.fn().mockRejectedValue(createCustomError);

      const expectedError = createCustomError(
        404,
        "No projects found",
        "Error while getting projects: "
      );

      await getAllCards(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expectedError);

      const nextCalled = (next as jest.Mock<any, any>).mock.calls[0][0];

      expect(nextCalled.privateMessage).toBe(expectedError.errorMessage);
    });
  });

  describe("When called but there are no projects avaliable", () => {
    test("Then it should respond informing that there are no projects with code ", async () => {
      const expectedStatus = 404;
      Card.find = jest.fn().mockReturnValue([]);

      const expectedResponse = {
        cards: "No cards found",
      };

      await getAllCards(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });
  });
});
