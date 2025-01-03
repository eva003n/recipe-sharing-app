import express from "express";
import { createRecipe, getAllRecipes, getSpecificRecipe, shareRecipe, searchRecipeByCriteria, saveFavoriteRecipe, createComment} from "../controllers/recipes.controller.js";
import { rateRecipe } from "../controllers/recipes.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
import {getRecipeDetails} from "../middlewares/recipe.middleware.js";
import { commentSchema, searchRecipeSchema, validateData, validateIdLength } from "../middlewares/validator.js";

const recipeRoutes = express.Router();

//get all the recipes
recipeRoutes.get("/", protectRoute, getAllRecipes);

//search for a recipe based on criteria
recipeRoutes.get("/search", protectRoute, validateData(searchRecipeSchema), searchRecipeByCriteria);

//get details of a specific recipe
recipeRoutes.get("/:id", protectRoute,validateIdLength,  getRecipeDetails, getSpecificRecipe);

//create a new  recipe
recipeRoutes.post("/", protectRoute, createRecipe);

//rate a recipe
recipeRoutes.post("/:id/rate", protectRoute,validateIdLength, rateRecipe);

//comment on a recipe
recipeRoutes.post("/:id/comments", protectRoute,validateIdLength, validateData(commentSchema), createComment);
//save a recipe to favourites
recipeRoutes.post("/:id/save", protectRoute,validateIdLength, saveFavoriteRecipe);
//share a recipe
recipeRoutes.get("/:id/share",protectRoute,validateIdLength, shareRecipe);

export default recipeRoutes;



