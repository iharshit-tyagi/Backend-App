import express from "express";
import { registerUser, loginUser } from "../controllers/user.controller.js";
const userRouter = express.Router();

userRouter.post("/register", registerUser);

userRouter.post("/login", loginUser);
userRouter.post("/login", (req, res) => {
  req.body;
});

export default userRouter;
