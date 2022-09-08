import { NextFunction, Request, Response } from "express";

const parseData = async (req: Request, res: Response, next: NextFunction) => {
  const newCard = req.body.card;

  const cardObject = await JSON.parse(newCard);

  cardObject.image = req.file.filename;

  req.body = cardObject;

  next();
};

export default parseData;
