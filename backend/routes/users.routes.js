import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { createUserProfile, followUser, getProfileDetails, updateProfile } from "../controllers/users.controller.js";

import { getRecipeCreatedByUser } from "../controllers/recipes.controller.js";
import { validateIdLength } from "../middlewares/validator.js";

const userRoutes = express.Router();

// user create profile only when authenticated

userRoutes.post("/", protectRoute,  createUserProfile);


//get user profile details
userRoutes.get("/profile", protectRoute, getProfileDetails);

//get recipe published by user
userRoutes.get("/:user_id/recipes", protectRoute, validateIdLength, getRecipeCreatedByUser);

//follow another user
userRoutes.post("/:user_id/follow", protectRoute, validateIdLength, followUser);

//update user profile details
userRoutes.put("/profile",  updateProfile);
//cretae user profile



export default userRoutes;