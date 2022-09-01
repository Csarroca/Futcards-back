import { NextFunction, Request, Response } from "express";
import User from "../../dataBase/models/users";
import { JwtPayload, AuthData, UserData } from "../../types/interfaces";
import { hashCreator, createToken, hashCompare } from "../../utils/auth/auth";
import createCustomError from "../../utils/createCustomError/createCustomError";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user: AuthData = req.body;

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

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.body as AuthData;

  const userError = createCustomError(
    403,
    "User not found",
    "User or password not valid"
  );
  let findUsers: Array<UserData>;
  try {
    // hacemos find para ver si existe el usuario el schema tiene user como propiedad y aqui tenemos userName en la dataiterface esto devuelve una pseudopromesa y por eso tenemos que hacer async await
    // esto devuelve una array vacio si no lo encueentra o array de 1 si esta
    findUsers = await User.find({ userName: user.userName });
    if (findUsers.length === 0) {
      next(userError);
      return;
    }
  } catch (error) {
    const finalError = createCustomError(
      403,
      `name:${(error as Error).name} ; nessage ${(error as Error).message}`,
      "user or password not valid"
    );
    next(finalError);
    return;
  }

  try {
    const isPasswdValid = await hashCompare(
      user.password,
      findUsers[0].password
    );
    if (!isPasswdValid) {
      userError.message = "Password invalid";
      next(userError);
      return;
    }
  } catch (error) {
    const finalError = createCustomError(
      403,
      `name:${(error as Error).name} ; nessage ${(error as Error).message}`,
      "user or password not valids"
    );
    next(finalError);
    return;
  }

  const payLoad: JwtPayload = {
    id: findUsers[0].id,
    userName: findUsers[0].userName,
  };
  const responseData = {
    user: {
      token: createToken(payLoad),
    },
  };

  res.status(200).json(responseData);
};
