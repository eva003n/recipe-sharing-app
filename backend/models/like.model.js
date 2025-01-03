import mongoose from "mongoose";
import { options } from ".";
 
const likeSchema = new Schema({
    userId:{
        type: Schema.ObjectId,
        required:[true, "UserId is required"]
    },
    recipeId:{
        type: Schema.ObjectId,
        required:[true, "RecipeId is required"]
    }
}, options);

const Like = mongoose.model("Like", likeSchema);
export default Like;

