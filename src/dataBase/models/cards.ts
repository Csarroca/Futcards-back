import { Schema, model } from "mongoose";

const robotSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },

  position: {
    type: String,
    required: true,
  },

  nacionallity: {
    type: String,
    required: true,
  },

  team: {
    type: String,
    required: true,
  },

  overall: {
    type: Number,
    required: true,
  },

  physicall: {
    type: Number,
    required: true,
  },

  pace: {
    type: Number,
    required: true,
  },

  passing: {
    type: Number,
    required: true,
  },

  defense: {
    type: Number,
    required: true,
  },

  shooting: {
    type: Number,
    required: true,
  },

  dribbling: {
    type: Number,
    required: true,
  },

  height: {
    type: Number,
    required: true,
  },

  age: {
    type: Number,
    required: true,
  },

  foot: {
    type: String,
    required: true,
  },

  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Card = model("card", robotSchema, "cards");

export default Card;
