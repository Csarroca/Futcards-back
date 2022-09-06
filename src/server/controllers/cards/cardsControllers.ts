import { NextFunction, Request, Response } from "express";
import Card from "../../../dataBase/models/cards";
import createCustomError from "../../../utils/createCustomError/createCustomError";

const getAllCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const allCards = await Card.find();

    if (!allCards.length) {
      res.status(404).json({ Cards: "No cards found" });
      return;
    }

    res.status(201).json(allCards);
  } catch (error) {
    const newError = createCustomError(
      404,
      "No cards found",
      `Error loading cards: ${error.message}`
    );
    next(newError);
  }
};

export default getAllCards;
