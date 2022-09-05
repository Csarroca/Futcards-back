import express from "express";
import getAllCards from "../controllers/cards/cardsControllers";

const cardsRouter = express.Router();

cardsRouter.get("/", getAllCards);

export default cardsRouter;
