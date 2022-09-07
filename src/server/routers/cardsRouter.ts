import express from "express";
import {
  createCard,
  deleteById,
  getAllCards,
} from "../controllers/cards/cardsControllers";
import authentication from "../middlewares/authentication";

const cardsRouter = express.Router();

cardsRouter.get("/", authentication, getAllCards);
cardsRouter.delete("/:id", deleteById);
cardsRouter.post("/create", createCard);

export default cardsRouter;
