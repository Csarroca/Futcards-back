import { NextFunction, Request, Response } from "express";
import User from "../../dataBase/models/users";
import { AuthData, JwtPayload } from "../../types/interfaces";
import { createToken } from "../../utils/auth/auth";
import createCustomError from "../../utils/createCustomError/createCustomError";
import { loginUser, registerUser } from "./usersControllers";

let hashCompareValue: boolean = true;

jest.mock("../../utils/auth/auth", () => ({
  ...jest.requireActual("../../utils/auth/auth"),
  hashCompare: () => hashCompareValue,
  createToken: jest.fn().mockReturnValue(""),
}));

describe("Given a registerUser controller function", () => {
  describe("When it's invoked", () => {
    const newUser: AuthData = {
      userName: "hola",
      password: "123",
    };

    const status = 201;

    const req: Partial<Request> = { body: newUser };

    test("Then it should call the status method with a 200", async () => {
      User.create = jest.fn().mockResolvedValue(newUser);
      const next: NextFunction = jest.fn();
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await registerUser(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(status);
    });

    test("And it should call the method json with the newUser created", async () => {
      User.create = jest.fn().mockResolvedValue(newUser);

      const next: NextFunction = jest.fn();
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockResolvedValue({ user: newUser }),
      };

      await registerUser(req as Request, res as Response, next);

      expect(res.json).toHaveBeenCalledWith({ user: newUser });
    });

    test("Then if it's rejected create method it should call the next function with a custom error", async () => {
      const error = createCustomError(401, "Error creating new user");
      User.create = jest.fn().mockRejectedValue(error);

      const next: NextFunction = jest.fn();
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockResolvedValue({ user: newUser }),
      };

      await registerUser(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
  describe("When a password or a userName is not provided", () => {
    test("Then it will call the next function with a custom error", async () => {
      const error = createCustomError(
        400,
        "Illegal arguments: undefined, number"
      );

      const next: NextFunction = jest.fn();
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockResolvedValue({}),
      };

      const req: Partial<Request> = { body: {} };
      await registerUser(req as Request, res as Response, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

describe("Given a loginUser controller function", () => {
  beforeEach(() => jest.clearAllMocks());

  const mockedReqBody = {
    userName: "paco",
    password: "paco12345",
  };

  const req = {
    body: mockedReqBody,
  } as Partial<Request>;

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as Partial<Response>;

  const next = jest.fn() as Partial<NextFunction>;

  User.find = jest.fn().mockReturnValue([mockedReqBody]);
  describe("When its invoke", () => {
    test("Then it should call the status method of the response with a status 200 if hash compare resolves true", async () => {
      hashCompareValue = true;
      await loginUser(req as Request, res as Response, next as NextFunction);

      const statusCode = 200;

      expect(res.status).toHaveBeenCalledWith(statusCode);
    });
  });
  test("It should call the next function with the created error if the hashcompare password resolved as false", async () => {
    hashCompareValue = false;
    const customError = createCustomError(
      400,
      "Password invalid",
      "Password error"
    );

    await loginUser(req as Request, res as Response, next as NextFunction);

    expect(next).toHaveBeenCalledWith(customError);
  });

  test("Then it should call the json method of the response", async () => {
    hashCompareValue = true;
    await loginUser(req as Request, res as Response, next as NextFunction);

    const payLoad: JwtPayload = {
      id: "678678",
      userName: "paco",
    };

    const responseData = {
      user: { token: createToken(payLoad) },
    };

    expect(res.json).toHaveBeenCalledWith(responseData);
  });

  test("It should call the next function with the created error if it wasn't posible to find the user", async () => {
    mockedReqBody.userName = "paco";
    mockedReqBody.password = "paco12345";
    hashCompareValue = true;

    User.find = jest.fn().mockReturnValue([]);

    await loginUser(req as Request, res as Response, next as NextFunction);

    const customError = createCustomError(
      403,
      "User not found",
      "Could not find user"
    );

    expect(next).toHaveBeenCalledWith(customError);
  });
  test("It should call the next function with the created error if an user find throw an error", async () => {
    mockedReqBody.userName = "paco";
    mockedReqBody.userName = "paco12345";

    hashCompareValue = true;

    User.find = jest.fn().mockRejectedValue(new Error());

    await loginUser(req as Request, res as Response, next as NextFunction);

    const customError = createCustomError(
      400,
      "User invalid",
      "user or password not valid"
    );

    expect(next).toHaveBeenCalledWith(customError);
  });
});
