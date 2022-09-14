import { NextFunction, Request, Response } from "express";
import Card from "../../../dataBase/models/cards";
import User from "../../../dataBase/models/users";
import mockedCard from "../../../test-utils/mocks/mockCard";
import createCustomError from "../../../utils/createCustomError/createCustomError";
import { CustomRequest } from "../../middlewares/authentication";
import {
  createCard,
  deleteById,
  getAllCards,
  getByPosition,
  updateCard,
} from "./cardsControllers";

afterEach(() => {
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
  describe("When it's called with a request, response and a Next function", () => {
    const next = jest.fn() as Partial<NextFunction>;

    const req = {
      body: { mockedCard },
      payload: { id: "testid" },
    } as Partial<Request>;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;

    Card.create = jest.fn().mockReturnValue(mockedCard);

    test("Then it should call the status method of the response", async () => {
      User.findById = jest.fn().mockResolvedValue({ futCards: [] });
      User.findByIdAndUpdate = jest.fn();

      await createCard(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      const statusCode = 201;

      expect(res.status).toHaveBeenCalledWith(statusCode);
    });
    test("Then it should call the json method of the response", async () => {
      await createCard(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(res.json).toHaveBeenCalledWith({ card: mockedCard });
    });

    test("It should call the next function with the created error if it wasn't posible to create the user", async () => {
      const error = createCustomError(404, "Error", "Error to load cards");

      Card.create = jest.fn().mockRejectedValue(error);

      await createCard(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

describe("Given a updateCard function controller", () => {
  describe("When it's called with a request, response and a Next function", () => {
    xtest("Then it should call the status method of the response and the json", async () => {
      const next = jest.fn() as Partial<NextFunction>;

      const req = {
        body: { mockedCard },
        params: { id: mockedCard.id },
      } as Partial<Request>;

      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockResolvedValue({ mockedCard }),
      };

      Card.findByIdAndUpdate = jest.fn().mockResolvedValue(mockedCard);

      await updateCard(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ card: mockedCard });
    });

    xtest("Then it should next with an error if it cannot complete the update", async () => {
      const error = createCustomError(400, "Could not update your card");
      const req = {
        params: mockedCard.id as unknown,
      } as Partial<Request>;
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockResolvedValue([]),
      };
      const next = jest.fn();
      Card.findByIdAndUpdate = jest.fn().mockRejectedValue(error);

      await updateCard(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

describe("Given a getByPosition function controller", () => {
  describe("When it's invoked with getByCategory method", () => {
    test("Then it should call the status method with a 200 and json with the games found", async () => {
      const req = {
        params: "ST" as unknown,
      } as Partial<Request>;
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockResolvedValue({ mockedCard }),
      };
      const next = jest.fn();
      Card.find = jest.fn().mockResolvedValue(mockedCard);

      await getByPosition(
        req as Request,
        res as Response,
        next as NextFunction
      );

      // expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ cards: mockedCard });
    });
    test("Then it should next with an error if the function throw an error ", async () => {
      const error = new Error();
      const req = {
        params: mockedCard.position as unknown,
      } as Partial<Request>;
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockResolvedValue([]),
      };
      const next = jest.fn();
      Card.find = jest.fn().mockRejectedValue(error);

      await getByPosition(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalled();
    });
  });
});
