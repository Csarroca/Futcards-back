import { Schema, model } from "mongoose";
// modelo de usuario de nuestra base de datos

export interface UserData {
  id: string;
  userName: string;
  passwd: string;
}
const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
  },
  passwd: {
    type: String,
    required: true,
  },
  futCards: [Schema.Types.ObjectId],
});

export const User = model("User", userSchema, "users");
