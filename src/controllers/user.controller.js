export const registerUser = async (req, res) => {
  res.status(200).json({
    message: "User Registered",
  });
};

export const loginUser = async (req, res) => {
  res.status(200).json({
    message: "Logged in",
  });
};
