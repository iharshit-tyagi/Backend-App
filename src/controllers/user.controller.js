import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

export const registerUser = async (req, res) => {
  -done;

  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res

  // get user details from frontend
  const userData = req.body;
  const { userName, email, fullName, password } = userData;

  // validation - not empty -done
  if (!userName || !email || !fullName || !password) {
    res.send(new ApiError(401, "One or More  required Parameter is Empty"));
  }

  // check if user already exists: username, email
  const userExist = await User.findOne({
    //to search for one document with or condition
    $or: [
      {
        username: userName,
        email: email,
      },
    ],
  });
  if (userExist) {
    res.send(new ApiError(410, "This Username or Email Already Exists"));
  }
};

export const loginUser = async (req, res) => {
  res.status(200).json({
    message: "Logged in",
  });
};
