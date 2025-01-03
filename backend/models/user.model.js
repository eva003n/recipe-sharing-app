import mongoose from "mongoose";
import { options } from "./index.js";


//user schema
const userSchema = mongoose.Schema(
  {
    userName: {
      type: String,
      lowercase: true,
      trim: true,

    },
    email: {
      type: String,
      required: [true, "Password is required!"],
      trim: true,
      minlength: [5, "Email must have at least 5 characters!"],
      lowercase: true,
    },
    password: {
      type: String,
      minlength: [8, "Password must be at least 8 characters!"],
      required: [true, "Password is required!"],
      trim: true,
      select: false, //prevent db from returning password unless we want it to
    },
    favouriteRecipes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "recipe Ids required"],
        ref: "SavedRecipe"
      },
    ],
    bio: {
      type: String,
      default: "Add a bio...",
    },
    photo: String,
    posts: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
      select: false,
    },
    notificationPreferences: {
      notifyLikes:{
        type: Boolean,
        default: true
      },
      notifyFollows: {
        type: Boolean,
        default: true
      },
      notifyRecipeUpdates:{
        type: Boolean,
        default: true
      },
    }
  },options
);


// userSchema.pre("save", async (next) => {
//   console.log("before i save model")
//   next();

// })
// userSchema.pre("validate", async(next) => {
//   console.log("before i validate model")
//   next();
// })
const User = mongoose.model("User", userSchema);

export default User;
