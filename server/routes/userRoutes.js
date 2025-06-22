import express from "express";
import { checkAuth, login, Signup, updateprofile, testCloudinary } from "../controllers/userController.js";
import { protectRoute } from "../middleware/auth.js";

const userRouter=express.Router();

userRouter.get("/test-cloudinary", testCloudinary);
userRouter.post("/signup",Signup);
userRouter.post("/login",login);
userRouter.put('/update-profile',protectRoute, updateprofile);
userRouter.get('/check', protectRoute, checkAuth);

export default userRouter;