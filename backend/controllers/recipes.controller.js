import Recipe from "../models/recipes.model.js";
import Comment from "../models/comment.model.js";

import { recipesSchema } from "../middlewares/validator.js";
import { SavedRecipe } from "../models/savedRecipes.model.js";

import { upload } from "../config/cloudinary.js";
import { validateMimeTypes } from "../utils/imageUpload.js";
import User from "../models/user.model.js";

//create a recipe
export const createRecipe = async (req, res) => {
  const {
    title,
    cuisineType,
    instructions,
    ingredients,
    tags,
    mealtype,
    dietaryPreference,
  } = req.body;

  try {
    if (req.body) {
      const { error, value } = recipesSchema.validate({
        title,
        cuisineType,
        instructions,
        ingredients,
        tags,
        mealtype,
        dietaryPreference,
      });

      if (error) {
        return res.status(400).json({
          message: error.message,
          
        });
      }

        if (!req.files && Object.keys(req.files).length === 0) {
          return res.status(400).json({
            message: "No files were choosen",
          });
        }
        const recipeImage = req.files.image;
        // console.log(recipeImage)
        // console.log(validateMimeTypes(recipeImage))
        if (!validateMimeTypes(recipeImage)) {
          return res.status(422).json({
            message: "Image format not supported!",
          });
        }

        //cloudinary file upload
        let imageUrl ="";
        let imageId = "";
try {
  const uploadedImage = await upload(recipeImage.data, "recipe-app-images")
  
  if(uploadedImage) {
    imageUrl = uploadedImage.secure_url;
    imageId = uploadedImage.public_id;

  }
  
} catch (e) {
  console.log(`cloudinary error ${e.message}`);
  return res.status(505).json({
    message: "Error uploading image"
  })

}
      const recipe = await Recipe.create({
        title,
        cuisineType,
        instructions,
        ingredients,
        dietaryPreference,
        createdBy: req.user._id,
        image: imageUrl,
        tags,
        mealType: mealtype,
      });
      res.status(201);
      res.json({
        message: "Recipe created successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Required fields cannot be empty",
      });
    }
  } catch (e) {
    console.log(e.message);
    res.status(500).json({
      message: "server error creating recipe",
    });
  }
};

export const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({}, {updatedAt: 0, createdAt: 0, __v:0})
      .populate({ path: "createdBy", select: "userName likes _id" })
      .sort({ createdAt: -1 })
      .exec();
    if (recipes) {
      return res.status(200).json(recipes);
    }
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({
      message: `Error fetching recipes!`,
    });
  }
};
export const getSpecificRecipe = async (req, res) => {
  try {
    const result = !req.recipe
      ? res.status(404).json({
          message: "Oops no recipe found!",
        })
      : res.status(200).json(req.recipe);

    return result;
  } catch (e) {
    res.status(500).json({
      message: `server error ${e.message}`,
    });
  }
};

//rating a specific  a recipe

export const rateRecipe = async (req, res) => {
  let { id } = req.params;
  const { rateCount } = req.body;

  try {
    const updateRating = await Recipe.updateOne(
      { _id: id },
      {$set: { rating: rateCount }}
    );
    console.log(updateRating)

    if (updateRating.acknowledged) {
      return res.status(201).json({
        message: "Rated successfully",
      });
    } else {
      return res.status(400).json({
        message: "Recipe not found!",
      });
    }
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({
      message: "Error occured!",
    });
  }
};

//saving favourite recipes
export async function saveFavoriteRecipe(req, res) {
  const { id } = req.params;

  try {
    const favouriteRecipe = await SavedRecipe.create({
      userId: req.user._id,
      recipeId: id,
    });
     const savedRecipes = await SavedRecipe.populate("recipeId").exec();
      await User.findById(id).populate("userId").exec();
      console.log(savedRecipes);
    const currentUser = req.user._id;
    const addedRecipe = await User.updateOne({_id: currentUser}, {favouriteRecipes: favouriteRecipe._id}).exec();
   
    if(addedRecipe.acknowledged) {
      return res.status(200).json({
        message: "recipe saved successfully"
      });

    }   
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({
      message: "Error occured while saving Recipe!",
    });
  }
}

//get all recipes

//search based on keywords eg mealtype, tags, ingredients, dietaryPreference,cuisine types
export const searchRecipeByCriteria = async (req, res) => {
  const { filter } = req.query;

  const pipeline = [
    {
      $search: {
        index: "recipe",
        text: {
          query: filter,
          path: ["ingredients", "dietaryPreference", "cuisineTYpes", "title"],
          fuzzy: {},
         
        },
        highlight: {
          path:["ingredients", "dietaryPreference", "cuisineTYpes", "title"]

        }
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "publishedBy",
      },
    },
//  {
//   $limit: 12
//  },
    {
      $project: {
        title: 1,
        ingredients: 1,
        instructions: 1,
        dietaryPreference: 1,
        tags: 1,
        "publishedBy.userName": 1,
        "publishedBy._id": 1,
        image: 1,
        rating: 1,
        mealType: 1,
        cuisineType: 1,
        score: {
          $meta:"searchScore"

        },
        highlight: {
          $meta: "searchHighlights"
          
        }
      },
    },
  ];
  try {
    const searchRecipeResult = await Recipe.aggregate(pipeline);
    if(searchRecipeResult.length) {
      return res.status(200).json(searchRecipeResult);
    }else{
      return res.status(404).json({
        message: "No matching recipes found!"
      });

    }
   
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({
      message: `Error occured while searching ${e.message}`,
    });
  }
};

//get recipe created by user | user id
export const getRecipeCreatedByUser = async (req, res) => {
  const { user_id } = req.params;

  try {
    const userRecipe = await Recipe.find({ "createdBy": user_id}, {updatedAt: 0, createdAt: 0, __v:0}).populate({ path: "createdBy", select: "userName  likes _id"}).sort({_id:-1}).exec();

    if (!userRecipe.length) {
      return res.status(404).json({
        message: "Oops user doesn't exist!",
      });
    }
    res.status(200).json(userRecipe);
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({
      message: "Error fetching recipe",
    });
  }
};

export const shareRecipe = async (req, res) => {

  let { id } = req.params;

  try {
    const matchingRecipe = await Recipe.findOne({_id: id})
      .populate({ path: "createdBy", select: "userName  likes _id" })
      .exec();

    if (matchingRecipe.length !== 0) {
      
      return res.status(200).json(matchingRecipe);
    }
  } catch (e) {
    console.log(`Error!${e.message}`);
    return res.status(500).json({
      message: "Error occured!",
    });
  }
};

export const createComment = async (req, res) => {
  try {
    const comment = await Comment.create({
      content: req.body.content,
      author: req.user._id,
      recipeId: req.params.id,
      replyTo: null
    });

    console.log(comment);
    res.status(200).json({
      message: "Posted successfully",
    });
   if(req.body.recipeId) {
    const comment = await Comment.create({
      content: req.body.content,
      author: req.user._id,
      recipeId: req.params.id,
   
    });

    console.log(comment);
    res.status(200).json({
      message: "Posted successfully",
    });
   }
  } catch (e) {
    console.log(e.message);
    res.status(500).json({
      message: "Error Posting comment",
    });
  }
};

