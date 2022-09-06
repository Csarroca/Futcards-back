import { NextFunction, Request, Response } from "express";
import Card from "../../../dataBase/models/cards";
import mockedCard from "../../../test-utils/mocks/mockCard";
import createCustomError from "../../../utils/createCustomError/createCustomError";
import { getAllCards } from "./cardsControllers";

describe("Given a getAllCards function", () => {
  const req = {} as Partial<Request>;
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as Partial<Response>;
  const next = jest.fn() as NextFunction;
  Card.find = jest.fn().mockResolvedValue([mockedCard]);

  describe("When called with a request, a response and a next function", () => {
    test("Then it should respond with a status of 201", async () => {
      const expectedStatus = 201;

      await getAllCards(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });

    test(`Then it should respond with all the cards found`, async () => {
      const expectedResponse = [mockedCard];

      await getAllCards(req as Request, res as Response, next);

      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });
  });

  describe("When called but the database doesn't return any valid data", () => {
    test("Then it should call next with an error", async () => {
      Card.find = jest.fn().mockRejectedValue(createCustomError);

      const expectedError = createCustomError(
        404,
        "No cards found",
        "Error to load cards"
      );

      await getAllCards(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When called but there are no projects avaliable", () => {
    test("Then it should respond with a message 'No cards found' ", async () => {
      const expectedStatus = 404;
      Card.find = jest.fn().mockReturnValue([]);

      const expectedResponse = {
        Cards: "No cards found",
      };

      await getAllCards(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });
  });
});
