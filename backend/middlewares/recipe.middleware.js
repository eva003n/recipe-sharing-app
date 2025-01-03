// import {ObjectId} from "mongoose";
import  Recipe  from "../models/recipes.model.js";
export const getRecipeDetails = async (req, res, next) => {
  // id = ObjectId.fromString();
  let {id } = req.params;  
  // id = ObjectId.fromString();
     console.log(id)

  try {
    const matchingRecipe = await Recipe.findOne({_id: id},{updatedAt: 0, createdyAt: 0, __v:0})
      .populate({ path: "createdBy", select: "userName  likes _id" })
      .exec();
   
    if (matchingRecipe.length !== 0) {
      req.recipe = matchingRecipe;
      console.log(req.recipe)
    
    }

    next();
  } catch (e) {
    console.log(`Error!${e.message}`);
    return res.status(500).json({
      message:"Error fetching recipe!"
    })
  }
};
