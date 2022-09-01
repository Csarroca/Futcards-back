import { NextFunction, Request, Response } from "express";
import User from "../../dataBase/models/users";
import { AuthData } from "../../types/interfaces";
import createCustomError from "../../utils/createCustomError/createCustomError";
import { registerUser } from "./usersControllers";

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
      const error = createCustomError(400, "Incorrect userName or password");

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
