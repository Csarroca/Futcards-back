import express from "express";
import { validate } from "express-validation";
import registerUser from "../controllers/usersControllers";
import userCredentialsSchema from "../schemas/userCredentialsSchema";

const usersRouter = express.Router();

usersRouter.post(
  "/register",
  validate(userCredentialsSchema, {}, { abortEarly: false }),
  registerUser
);

usersRouter.post("/login");

export default usersRouter;
