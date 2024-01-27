import { ApiError } from "../utils/ApiError.js";

import { User } from "../models/user.model.js";
import uploadFile from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Jwt from "jsonwebtoken";
import { cookieOptions } from "../utils/constants.js";

//this will update in databse also
const generateAccessAndRefreshToken = async (userID) => {
  const user = await User.findById(userID);

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save();
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
      .json(
        new ApiError(
          400,
          "This is message.",
          "User Does not exist , Please Signup"
        )
      );
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
  //To get info of loggedIn User --Now this will have refresh token
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  //cookie will only be accessible through the HTTP protocol, and the browser will only send it over secure (HTTPS) connections.

  res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "Logged In Successfully"
      )
    );
};

export const logoutUser = async (req, res) => {
  //Now due to middleware, I have user info in req object
  //1. Clear access token from db
  //2.Clear cookie

  try {
    await User.findByIdAndUpdate(req?.user?._id, {
      $set: {
        //in case we need to update multiple values
        refreshToken: undefined,
      },
    });
  } catch (error) {}
  //To clear value from Cookies
  res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, null, "Logged Out"));
};
export const refreshAccessToken = async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken;
  if (!incomingRefreshToken) {
    res.status(401).json({
      message: "User is not logged in",
    });
    return;
  }
  const decodedToken = await Jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  const user = await User.findById(decodedToken._id);
  if (!user) {
    res.status(401).json({
      message: "Refresh Token is Invalid",
    });
    return;
  }

  if (incomingRefreshToken !== user.refreshToken) {
    res.status(401).json({
      message: "Refresh Token has expired or Invalid",
    });
    return;
  }
  //also updated in Db by the below method
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  res
    .status(200)
    .cookie("accessToken", accessToken)
    .cookie("refreshToken", refreshToken)
    .json(
      new ApiResponse(
        200,
        {
          accessToken,
          refreshToken,
        },
        "Access Token is refreshed"
      )
    );
};
export const changeCurrentPassword = async (req, res) => {
  //Check if old password is correct
  //take new password and encrypt it and save it
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    res
      .status(401)
      .json(
        new ApiError(
          401,
          "Invalid Request, Please share both old and new password"
        )
      );
    return;
  }
  const user = await User.findById(req?.user?._id);

  const isPasswordValid = await user.issPasswordCorrect(oldPassword);

  if (!isPasswordValid) {
    res
      .status(200)
      .json(
        new ApiError(401, "Invalid Password, Please enter correct password.")
      );
    return;
  }
  user.password = newPassword;
  await user.save();
  res
    .status(200)
    .json(
      new ApiResponse(200, isPasswordValid, "Password is sucessfully updated.")
    );
};
export const getCurrentUser = async (req, res) => {
  req.user.password = undefined;
  res.status(200).json(new ApiResponse(200, req?.user, "Successful"));
};

export const updateEmail = async (req, res) => {
  const { email, fullName } = req.body;
  if (!email || !fullName) {
    res.status(401).json(new ApiError(401, "All fields are required."));
    return;
  }
  const user = User.findByIdAndUpdate(req?.user?._id, {
    $set: {
      fullName,
      email,
    },
  }).select("-password");
  res
    .status(200)
    .json(new ApiResponse(200, user, "Account details have been updated"));
  console.log(user);
};
