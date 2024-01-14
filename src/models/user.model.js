import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: "String",
      unique: true,
      required: true,
    },
    email: {
      type: "String",
      unique: true,
      required: true,
    },
    fullName: {
      type: "String",
      unique: true,
      required: true,
    },
    avatar: {
      type: "String",
    },
    coverImage: {
      type: "String",
    },
    password: {
      type: "String",
    },
    refreshToken: {
      type: "String",
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
