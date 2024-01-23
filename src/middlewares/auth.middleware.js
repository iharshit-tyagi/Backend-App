//To check if a user is logged in or not
// We will check that by verifying the accessToken of any user
import Jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
const verifyJWT = async (req, res, next) => {
  //Now first I need the access Token to decode and verify
  const token = req?.cookies?.accessToken;
  if (!token) {
    next();
  }
  const decodedToken = Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  const user = await User.findById(decodedToken._id);
  if (!user) {
    console.log("Invalid Access Token");
  }
  //If user is there then update user in req itself
  req.user = user;
  next();
};
export default verifyJWT;
