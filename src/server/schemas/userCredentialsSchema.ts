import { Joi } from "express-validation";

const userCredentialsSchema = {
  body: Joi.object({
    userName: Joi.string().min(4).max(15).required(),
    password: Joi.string().min(8).max(15).required(),
  }),
};

export default userCredentialsSchema;
