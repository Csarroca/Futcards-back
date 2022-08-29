import { Schema, model } from "mongoose";

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

const User = model("User", userSchema, "users");

export default User;
