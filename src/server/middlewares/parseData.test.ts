import { NextFunction, Request, Response } from "express";
import fs from "fs/promises";
import path from "path";
import { ProtoCardData } from "../../types/interfaces";
import createCustomError from "../../utils/createCustomError/createCustomError";
import parseData from "./parseData";

jest.useFakeTimers();

describe("Given a parseData middleware", () => {
  describe("When called with a request, a response and a next function as arguments", () => {
    const mockedReqBody: ProtoCardData = {
      name: "Seirroks",
      position: "ST",
      nacionallity: "Spain",
      team: "FCB",
      overall: 95,
      physicall: 90,
      pace: 90,
      passing: 97,
      defense: 88,
      shooting: 99,
      dribbling: 98,
      height: 1.81,
      age: 29,
      foot: "L",
      owner: "aqqee12kk34d",
    };

    const cardJson = JSON.stringify(mockedReqBody);

    jest
      .spyOn(path, "join")
      .mockReturnValue(`${path.join("uploads", "images")}`);

    jest.spyOn(fs, "rename").mockResolvedValue();

    const req = {
      body: { card: cardJson },
      file: { filename: "file", originalname: "file" },
    } as Partial<Request>;

    const res = {} as Partial<Response>;

    const next = jest.fn() as NextFunction;

    test("Then it should asign the data as req body", async () => {
      await parseData(req as Request, res as Response, next);

      expect(req.body).toStrictEqual({
        ...mockedReqBody,
        image: `${Date.now()}${req.file.filename}`,
      });

      expect(next).toHaveBeenCalled();
    });
    test("Then it should asign the data as req body", async () => {
      const reqWithoutImage = {
        body: { card: cardJson },
      } as Partial<Request>;

      const customError = createCustomError(
        404,
        "Data not found",
        "Missing data"
      );
      await parseData(reqWithoutImage as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(customError);
    });
  });
});
