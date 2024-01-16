export const registerUser = async (req, res) => {
  // get user details from frontend- done
  // validation - not empty -done
  // check if user already exists: username, email
  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res
  const userData = req.body;
  const { userName, email, fullName } = userData;
  if (!userName || !email || !fullName) {
    res.status(401).json({
      message: "Including USername , Email &  Full name is mandatory",
    });
  } else
    res.status(200).json({
      message: userName,
    });
};

export const loginUser = async (req, res) => {
  res.status(200).json({
    message: "Logged in",
  });
};
