import express from "express";
import { validate } from "express-validation";
import { loginUser, registerUser } from "../controllers/users/usersControllers";
import userCredentialsSchema from "../schemas/userCredentialsSchema";

const usersRouter = express.Router();

usersRouter.post(
  "/register",
  validate(userCredentialsSchema, {}, { abortEarly: false }),
  registerUser
);

usersRouter.post("/login", loginUser);

export default usersRouter;
