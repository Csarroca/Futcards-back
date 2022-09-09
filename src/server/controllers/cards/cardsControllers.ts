import debug from "debug";
import { NextFunction, Request, Response } from "express";
import Card from "../../../dataBase/models/cards";
import User from "../../../dataBase/models/users";
import createCustomError from "../../../utils/createCustomError/createCustomError";
import { CustomRequest } from "../../middlewares/authentication";

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
  const idCard = req.params.id;
  debug("Deleting card");

  try {
    await Card.findByIdAndDelete(idCard);
    res.status(200).json({ message: "Successfully deleted card" });

    debug("Card deleted");
  } catch (error) {
    const newError = createCustomError(
      404,
      "No cards found with that id",
      "Error deleting card"
    );
    next(newError);
  }
};
export const createCard = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const card = req.body;

  card.owner = req.payload.id.toString();

  try {
    const newCard = await Card.create(card);

    const user = await User.findById(req.payload.id);

    user.futCards.push(newCard.id);
    await user.save();

    res.status(201).json({ card: newCard });
  } catch (error) {
    const customError = createCustomError(
      400,
      error.message,
      "Error creating new card"
    );

    next(customError);
  }
};
