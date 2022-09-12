import express from "express";
import multer from "multer";
import {
  createCard,
  deleteById,
  getAllCards,
  getById,
  getByPosition,
  updateCard,
} from "../controllers/cards/cardsControllers";
import authentication from "../middlewares/authentication";
import parseData from "../middlewares/parseData";
import supabaseUpload from "../middlewares/supaBase";

const cardsRouter = express.Router();

const upload = multer({ dest: "uploads", limits: { fileSize: 3000000 } });

cardsRouter.get("/", authentication, getAllCards);
cardsRouter.delete("/:id", authentication, deleteById);
cardsRouter.post(
  "/create",
  upload.single("image"),
  parseData,
  supabaseUpload,
  createCard
);
cardsRouter.get("/:id", getById);

cardsRouter.put(
  "/updateCard/:id",
  upload.single("image"),
  parseData,
  supabaseUpload,
  updateCard
);

cardsRouter.get("/category/:category", getByPosition);

export default cardsRouter;
