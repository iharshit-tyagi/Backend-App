import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowecase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, // cloudinary url
      required: true,
    },
    coverImage: {
      type: String, // cloudinary url
    },
    watchHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
//To hash our password before storing
userSchema.pre("save", async function () {
  //To no change password if password is not modified
  if (!this.isModified("password")) return next();

  //to hash and change password if password was modified
  this.password = bcrypt.hash(this.password, 10);
  next();
});

//Adding method to the schema--> To check if password is correct or not
userSchema.methods.issPasswordCorrect = async function (password) {
  await bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", userSchema);
