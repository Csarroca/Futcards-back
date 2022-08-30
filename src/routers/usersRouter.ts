import express from "express";
import registerUser from "../server/controllers/usersControllers";

const usersRouter = express.Router();

usersRouter.post("/register", registerUser);

export default usersRouter;
