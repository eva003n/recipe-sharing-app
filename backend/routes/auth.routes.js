import express from "express";
import { signUp, logIn, logOut, tokenRefresh,  } from "../controllers/auth.controller.js";
import { authenticateToken } from "../middlewares/authenticate.js";
import { logInSchema, validateData } from "../middlewares/validator.js";

// import {signUp} from "../controllers/auth.controllers.js";

export const authRoutes = express.Router();

authRoutes.post("/signup", signUp);

authRoutes.post("/login", validateData(logInSchema), logIn);
authRoutes.delete("/logout", logOut);
authRoutes.post("/refreshtoken", tokenRefresh);

// authRoutes.patch("/verify", sendVerificationCode);

export default authRoutes;



