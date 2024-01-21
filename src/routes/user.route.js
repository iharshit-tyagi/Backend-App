import express from "express";
import { registerUser, loginUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
const userRouter = express.Router();

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
});
userRouter.post("/login", (req, res) => {
  req.body;
});

export default userRouter;
