import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import uploadFile from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshToken = async (userID) => {
  const user = await User.findById(userID);
  console.log(userID);
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  console.log(accessToken, refreshToken);
  user.refreshToken = refreshToken;
  user.save();
  return { accessToken, refreshToken };
};
export const registerUser = async (req, res) => {
  // get user details from frontend
  const userData = req.body;
  const { username, email, fullName, password } = userData;

  // validation - not empty -done
  if (!username || !email || !fullName || !password) {
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
        username: username,
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
    username: username.toLowerCase(),
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
  //validate password

  //read data
  const { username, password, email } = req.body;

  //check if data is there
  if (!username && !email) {
    // throw new ApiError(400, "At least one of Email or Password is required.");
    res
      .status(400)
      .json(
        new ApiError(400, "", "At least one of Email or Password is required.")
      );
    return;
  }

  //Check if user Exist
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) {
    res
      .status(404)
      .json(new ApiError(400, "", "User Does not exist , Please Signup"));
    return;
  }

  const isPasswordValid = await user.issPasswordCorrect(password);
  if (!isPasswordValid) {
    res.status(403).json(new ApiError(403, "", "Invalid Credentials"));
    return;
  }
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );
  // generateAccessAndRefreshToken(user._id);
  res.status(200).json({ message: "Logged In" });
};
