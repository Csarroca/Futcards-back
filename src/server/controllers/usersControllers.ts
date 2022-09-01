import { NextFunction, Request, Response } from "express";
import User from "../../dataBase/models/users";
import { UserRegister } from "../../types/interfaces";
import hashCreator from "../../utils/authentication/authentication";
import createCustomError from "../../utils/createCustomError/createCustomError";

const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user: UserRegister = req.body;

  if (!user.userName || !user.password) {
    const error = createCustomError(
      400,
      "Incorrect userName or password",
      "Incorrect userNmae or password"
    );
    next(error);
    return;
  }

  try {
    user.password = await hashCreator(user.password);
    const newUser = await User.create({
      userName: user.userName.toString(),
      password: user.password.toString(),
    });

    res.status(201).json({ user: newUser });
  } catch (error) {
    const customError = createCustomError(
      401,
      error.message,
      "Error creating new user"
    );

    next(customError);
  }
};

export default registerUser;
