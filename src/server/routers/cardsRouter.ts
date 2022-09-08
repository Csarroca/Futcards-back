import express from "express";
import multer from "multer";
import {
  createCard,
  deleteById,
  getAllCards,
} from "../controllers/cards/cardsControllers";
import authentication from "../middlewares/authentication";
import parseData from "../middlewares/parseData";

const cardsRouter = express.Router();

const upload = multer({ dest: "uploads", limits: { fileSize: 3000000 } });

cardsRouter.get("/", authentication, getAllCards);
cardsRouter.delete("/:id", deleteById);
cardsRouter.post(
  "/create",
  authentication,
  upload.single("image"),
  parseData,
  createCard
);

export default cardsRouter;
