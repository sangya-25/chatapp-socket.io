import express from "express";
import { checkAuth, login, Signup, updateprofile } from "../controllers/userController.js";
import { protectRoute } from "../middleware/auth.js";

const userRouter=express.Router();

userRouter.post("/signup",Signup);
userRouter.post("/login",login);
userRouter.put('/update-profile',protectRoute, updateprofile);
userRouter.get('/check', checkAuth);

export default userRouter;