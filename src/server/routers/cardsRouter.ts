import express from "express";
import multer from "multer";
import {
  createCard,
  deleteById,
  getAllCards,
} from "../controllers/cards/cardsControllers";
import authentication from "../middlewares/authentication";

const cardsRouter = express.Router();

const upload = multer({ dest: "uploads", limits: { fileSize: 3000000 } });

cardsRouter.get("/", authentication, getAllCards);
cardsRouter.delete("/:id", authentication, deleteById);
cardsRouter.post("/create", authentication, upload.single("image"), createCard);

export default cardsRouter;
