export const registerUser = async (req, res) => {
  // get user details from frontend
  // validation - not empty
  // check if user already exists: username, email
  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res
  res.status(200).json({
    message: "User Registered",
  });
};

export const loginUser = async (req, res) => {
  res.status(200).json({
    message: "Logged in",
  });
};
