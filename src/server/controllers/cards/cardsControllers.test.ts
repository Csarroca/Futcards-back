import { NextFunction, Request, Response } from "express";
import Card from "../../../dataBase/models/cards";
import mockedCard from "../../../test-utils/mocks/mockCard";
import createCustomError from "../../../utils/createCustomError/createCustomError";
import { CustomRequest } from "../../middlewares/authentication";
import { createCard, deleteById, getAllCards } from "./cardsControllers";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Given a getAllCards function controller", () => {
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

  describe("When called but there are no cards avaliable", () => {
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

describe("Given a deleteById function controller", () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as Partial<Response>;
  const next = jest.fn() as NextFunction;
  describe("When it receives a request and a valid id", () => {
    test("Then it should response with a method status and a 'Successfully deleted card' message", async () => {
      const expectedMessage = { message: "Successfully deleted card" };
      const request = {
        params: { id: "12" },
      } as Partial<Request>;

      Card.findByIdAndDelete = jest.fn().mockResolvedValue(request);
      const expectedStatus = 200;

      await deleteById(
        request as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(expectedMessage);
    });
  });

  describe("When recives an invalid or empty id", () => {
    test("Then it should respon with a message 'No cards found' ", async () => {
      const request = {
        params: { id: "" },
      } as Partial<Request>;

      const expectedError = createCustomError(
        404,
        "No cards found with that id",
        "Error to load cards"
      );
      Card.findByIdAndDelete = jest.fn().mockRejectedValue(request);

      await deleteById(
        request as Request,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
describe("Given a createCard function controller", () => {
  beforeEach(() => jest.clearAllMocks());
  const next = jest.fn() as Partial<NextFunction>;

  const cardJson = JSON.stringify(mockedCard);
  const req = {
    body: { card: cardJson },
  } as Partial<Request>;

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as Partial<Response>;

  Card.create = jest.fn().mockReturnValue(mockedCard);

  const errorCustom = createCustomError(400, "", "Error creating new card");
  describe("When it's called with a request, response and a Next function", () => {
    test("Then it should call the status method of the response", async () => {
      createCard(req as CustomRequest, res as Response, next as NextFunction);

      const statusCode = 201;

      expect(res.status).toHaveBeenCalledWith(statusCode);
    });
    test("Then it should call the json method of the response", async () => {
      await createCard(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(res.json).toHaveBeenCalledWith({ newCard: mockedCard });
    });

    test("It should call the next function with the created error if it wasn't posible to create the user", async () => {
      const expectedError = createCustomError(
        404,
        "No cards found",
        "Error to load cards"
      );

      Card.create = jest.fn().mockRejectedValue(expectedError);

      await createCard(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(errorCustom);
    });
  });
});
