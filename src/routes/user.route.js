import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import verifyJWT from "../middlewares/auth.middleware.js";
const userRouter = express.Router();

//TODO Add error handler middleware
// userRouter.use((err, req, res, next) => {
//   res
// });

userRouter.post(
  "/register",
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  (req, res) => {
    registerUser(req, res);
  }
);

userRouter.post("/login", (req, res, next) => {
  loginUser(req, res);
  // console.log(req.body);
});

//secure routes --> verifyJwt can be used to check if user is logged in or not
userRouter.post("/logout", verifyJWT, logoutUser);

userRouter.route("/refresh-token").post(refreshAccessToken);
userRouter.post("/changeCurrentPassword", verifyJWT, changeCurrentPassword);

userRouter.get("/getCurrentUser", verifyJWT, getCurrentUser);
export default userRouter;
