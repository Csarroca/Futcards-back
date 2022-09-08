import { NextFunction, Request, Response } from "express";
import { ProtoCardData } from "../../types/interfaces";
import parseData from "./parseData";

describe("Given a parseData moddleware", () => {
  describe("When called with a request, a response and a next function as arguments", () => {
    const mockedReqBody: ProtoCardData = {
      name: "Seirroks",
      image: "url",
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
    const req = {
      body: { card: cardJson },
      file: { filename: "fileTest" },
    } as Partial<Request>;

    const res = {} as Partial<Response>;

    const next = jest.fn() as NextFunction;

    test("Then it should asign the data as req body", async () => {
      await parseData(req as Request, res as Response, next);

      expect(req.body).toStrictEqual({
        ...mockedReqBody,
        image: req.file.filename,
      });

      expect(next).toHaveBeenCalled();
    });
  });
});
