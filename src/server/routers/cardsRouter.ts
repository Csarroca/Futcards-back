import express from "express";
import multer from "multer";
import {
  createCard,
  deleteById,
  getAllCards,
  getById,
  updateCard,
} from "../controllers/cards/cardsControllers";
import authentication from "../middlewares/authentication";
import parseData from "../middlewares/parseData";

const cardsRouter = express.Router();

const upload = multer({ dest: "uploads", limits: { fileSize: 3000000 } });

cardsRouter.get("/", authentication, getAllCards);
cardsRouter.delete("/:id", authentication, deleteById);
cardsRouter.post("/create", upload.single("image"), parseData, createCard);
cardsRouter.get("/:id", getById);

cardsRouter.put(
  "/updateCard/:id",
  upload.single("image"),
  parseData,
  updateCard
);

export default cardsRouter;
