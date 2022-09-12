import debug from "debug";
import { NextFunction, Request, Response } from "express";
import Card from "../../../dataBase/models/cards";
import User from "../../../dataBase/models/users";
import { CardData } from "../../../types/interfaces";
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

  try {
    const newCard = await Card.create(card);

    const user = await User.findById(card.owner);
    await User.findByIdAndUpdate(card.owner, {
      cards: [...user.futCards, newCard.id],
    });

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

export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const idCard = req.params.id;
  debug("Finding card");

  try {
    const card = await Card.findById(idCard);
    res.status(200).json({ card });

    debug("Card Found");
  } catch (error) {
    const newError = createCustomError(
      404,
      "No cards found with that id",
      "Error geting card"
    );
    next(newError);
  }
};

export const updateCard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const {
    age,
    defense,
    dribbling,
    foot,
    height,
    image,
    nacionallity,
    name,
    overall,
    pace,
    passing,
    physicall,
    position,
    shooting,
    team,
    owner,
  }: CardData = req.body;

  try {
    const cardUpdated = {
      age,
      defense,
      dribbling,
      foot,
      height,
      id,
      image,
      nacionallity,
      name,
      overall,
      owner,
      pace,
      passing,
      physicall,
      position,
      shooting,
      team,
    };

    await Card.findByIdAndUpdate(id, cardUpdated);
    const newCardUpdated = await Card.findById(id);
    const statusCode = 201;
    res.status(statusCode).json({ newCardUpdated });
  } catch (error) {
    const errorCustom = createCustomError(
      400,
      "Error updating your card",
      "Could not update your card"
    );
    next(errorCustom);
  }
};
