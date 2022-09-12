import { NextFunction, Request, Response } from "express";
import fs from "fs/promises";
import { CustomError } from "../../types/interfaces";
import createCustomError from "../../utils/createCustomError/createCustomError";
import supabaseUpload from "./supaBase";

const url = "futCards.com";
const req = {
  body: {
    image: "404.png",
  },
} as Partial<Request>;
const res = {} as Partial<Response>;
const next = jest.fn() as NextFunction;

let mockUpload = jest.fn().mockReturnValue({
  error: null,
});

jest.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    storage: {
      from: () => ({
        upload: mockUpload,
        getPublicUrl: () => ({
          publicURL: url,
        }),
      }),
    },
  }),
}));

describe("Given a supabaseUpload function", () => {
  beforeEach(() => jest.clearAllMocks());
  beforeAll(async () => {
    await fs.writeFile(`uploads/${req.body.image}`, "content");
  });

  afterAll(async () => {
    await fs.unlink(`uploads/${req.body.image}`);
  });

  describe("When it is called with a request, a response and a next function", () => {
    test("Then it should call next function", async () => {
      await supabaseUpload(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalled();
    });

    test("Then it should upload the file", async () => {
      await supabaseUpload(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(mockUpload).toHaveBeenCalled();
    });

    test("If the upload fails, it should call next with an error", async () => {
      mockUpload = jest.fn().mockReturnValue({
        error: true,
      });

      await supabaseUpload(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(true);
    });

    test("Then it should set the image url as backup image at the body request", async () => {
      await supabaseUpload(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(req.body.backupImage).toBe(url);
    });

    test("If the upload reject as an error it should call next with the created error", async () => {
      mockUpload = jest.fn().mockRejectedValue(new Error());

      const expectedError = createCustomError(
        404,
        "Couldn't upload or read the image",
        "Error while reading and uploading the image"
      );

      await supabaseUpload(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(expectedError);

      const nextCalled = (next as jest.Mock<any, any>).mock.calls[0][0];
      expect(nextCalled.privateMessage).toBe(
        (expectedError as CustomError).privateMessage
      );
    });
  });
});
