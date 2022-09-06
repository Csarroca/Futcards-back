import debug from "debug";
import { NextFunction, Request, Response } from "express";
import Card from "../../../dataBase/models/cards";
import createCustomError from "../../../utils/createCustomError/createCustomError";

export const getAllCards = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

export const deleteById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const idExercise = req.params.id;
  debug("Deleting card");

  try {
    await Card.findByIdAndDelete(idExercise);
    res.status(200).json({ message: "Successfully deleted card" });

    debug("Card deleted");
  } catch (error) {
    const newError = createCustomError(
      404,
      "No exercises found",
      "Error deleting exercise"
    );
    next(newError);
  }
};
