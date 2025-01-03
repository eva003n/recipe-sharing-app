import mongoose from "mongoose";
import { options } from "./index.js";

const recipeSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required!"],
      trim: true,
    },
    cuisineType: {
      type: String,
      lowercase: true,
      trim: true,
    },
    dietaryPreference: {
      type: String,
      lowercase: true,
      trim: true,
    },
    mealType: {
      type: String,
      lowercase: true,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId, //link up the user with recipe post
      ref: "User",
      required: [true, "Recipe creator reqired"],
    },

    ingredients: [
      {
        type: String,
        required: [true, "Ingredients is required!"],
      },
    ],
    instructions: [
      {
        type: String,
        required: [true, "Instructions are required!"],
      },
    ],
    image: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0

    },

    tags: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],
  },
  options
);



 const Recipe = mongoose.model("Recipe", recipeSchema);

//  recipeSchema.pre("save", function () {
//   this.post++;
//  })
 export default Recipe;