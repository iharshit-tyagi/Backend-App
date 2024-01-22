import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import uploadFile from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
export const registerUser = async (req, res) => {
  // get user details from frontend
  const userData = req.body;
  const { userName, email, fullName, password } = userData;

  // validation - not empty -done
  if (!userName || !email || !fullName || !password) {
    res
      .status(401)
      .json(new ApiError(401, "", " One or More  required Parameter is Empty"));
    return;
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
    return;
  }
  //To get the local file paths after multer saved them on local server
  // const avatarLocalPath = req.files?.avatar[0]?.path;
  //const coverImageLocalPath = req.files?.coverImage[0]?.path;
  let avatarLocalPath = "";
  let coverImageLocalPath = "";
  if (req?.files?.avatar) {
    avatarLocalPath = req.files?.avatar[0]?.path;
  }
  if (req?.files?.coverImage) {
    console.log(!req?.files?.coverImage);
    coverImageLocalPath = req.files?.coverImage[0]?.path;
  }

  //To check if we have avatar image
  if (!avatarLocalPath) {
    res.status(400).json(new ApiError(400, "", "Avatar File is Required."));
    return;
  }
  //To upload to cloudinary
  const avatar = await uploadFile(avatarLocalPath);
  const coverImage = await uploadFile(coverImageLocalPath);
  const user = await User.create({
    username: userName.toLowerCase(),
    fullName,
    email,
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  //finding user in Database and rmeoving the password and refresh tokens
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    res
      .status(500)
      .json(
        new ApiError(500, "Something went wrong while registering the user")
      );
    return;
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
};

export const loginUser = async (req, res) => {
  res.status(200).json({
    message: "Logged in",
  });
};
