import express from "express";
import getAllCards from "../controllers/cards/cardsControllers";
import authentication from "../middlewares/authentication";

const cardsRouter = express.Router();

cardsRouter.get("/", authentication, getAllCards);

export default cardsRouter;
