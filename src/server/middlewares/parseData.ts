import { NextFunction, Request, Response } from "express";

import fs from "fs/promises";
import path from "path";
import createCustomError from "../../utils/createCustomError/createCustomError";

const parseData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newCard = req.body.card;

    const cardObject = await JSON.parse(newCard);

    const newName = `${Date.now()}${req.file.originalname}`;
    cardObject.picture = newName;

    await fs.rename(
      path.join("uploads", req.file.filename),
      path.join("uploads", newName)
    );

    cardObject.image = req.file.filename;

    req.body = cardObject;

    next();
  } catch (error) {
    const customError = createCustomError(404, "Data not foud", "Missing data");
    next(customError);
  }
};

export default parseData;
