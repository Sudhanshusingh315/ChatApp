import { Router } from "express";
import { login, signup, profileSetup } from "../controllers/authController.js";

const authRoutes = Router();

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.post("/profileSetup", profileSetup);

export default authRoutes;
