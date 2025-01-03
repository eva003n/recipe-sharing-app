import Joi from "joi";

export const signUpSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30),

  email: Joi.string()
    .min(6)
    .max(60)
    .required()
    .email({
      tlds: { allow: ["com", "net"] },
    }),
  password: Joi.string()
    .min(8)
    .required()
    .pattern(new RegExp("^(?![._])([a-zA-Z][a-zA-Z0-9._]{7,19})(?<![._])$"))
    .message("Password doesnt satisfy requirement!"),
});
export const logInSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30),

  email: Joi.string()
    .min(6)
    .max(60)
    .required()
    .email({
      tlds: { allow: ["com", "net"] },
    }),
  password: Joi.string()
    .min(8)
    .required()
    .pattern(new RegExp("^(?![._])([a-zA-Z][a-zA-Z0-9._]{7,19})(?<![._])$"))
    .message("Password doesnt satisfy requirement!"),
});
export const recipesSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  cuisineType: Joi.string().min(3).max(100).required(),
  instructions: Joi.array().min(3).required(),
  ingredients: Joi.array().required(),
  mealtype: Joi.string(),
  tags: Joi.array(),
  dietaryPreference: Joi.string().min(3),
  rating: Joi.number().integer().min(1).max(5),
});

export const profileValidation = Joi.object({
  bio: Joi.string().trim(),
  username: Joi.string().trim(),
  notifyComments: Joi.boolean,
  notifyFollows:Joi.boolean,
  notifyLikes:Joi.boolean
});
export const commentSchema = Joi.object({
  content: Joi.string().trim().required(),
  author: Joi.string().trim().required(),
  recipeId: Joi.string().trim().required(),
});
export const replyCommentsSchema = Joi.object({
  text: Joi.string().trim().required,
  author: Joi.string().trim().required,
  replyTo: Joi.string().trim().required,
});
export const searchRecipeSchema= Joi.object({
  filter: Joi.string().trim().required("Invalid request!"),
  
});

export function validateData(schema) {
  return async (req, res, next) => {
    try {
      schema.validate({
        
          ...(req && req.body && { body: req.body }),
          ...(req && req.query && { query: req.query }),
          ...(req && req.params && { params: req.params }),
      
      
      });
      next();
    } catch (e) {
      console.log("here")
      console.log(e.message);
      res.staus(400).json({
        message: `Error! ${e.message}`,
      });
    }
  };
}

export const validateIdLength = async(req, res, next) => {
  const id = req.params.id || req.params.user_id;

  const idLength = id.length;
  if(idLength < 24) {


    return res.status(400).json({
      message:`Invalid Id expected 24 characters received ${idLength} characters `
    });
  }
  next();

}
/*
validation made easy
https://dev.to/osalumense/validating-request-data-in-expressjs-using-zod-a-comprehensive-guide-3a0j

*/