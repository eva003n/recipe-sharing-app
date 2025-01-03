
import { options } from "./index.js";
import mongoose from "mongoose";

const savedRecipeSchema = mongoose.Schema(
    {
    
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"

        },
        recipeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Recipe"

        }


    },options);
export const SavedRecipe = mongoose.model("SavedRecipe", savedRecipeSchema);

export default SavedRecipe;
