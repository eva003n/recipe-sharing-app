import mongoose from "mongoose";
import { options } from "./index.js";


/**
 * comments research
  https://medium.com/@pmadhav279/building-dynamic-conversations-a-step-by-step-guide-to-implementing-a-nested-comment-system-in-56055a586a50
 */
const commentSchema = mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Comment text is required!"],
      trim: true,
      lowercase: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    //post
    recipeId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    //parent comment
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
     
    }
 
  },
  options
);
const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
