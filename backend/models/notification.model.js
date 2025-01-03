import mongoose from "mongoose";
import { options } from "./index.js";

const notificationSchema = mongoose.Schema(
    {
    message: {
        type: String,
        required:[true, "Message is required"]
    },
    recipeId:{
        type: mongoose.Schema.ObjectId,
        required:[true, "RecipeId is required"],
    },

    userId:{
        type: mongoose.Schema.ObjectId,
        required:[true, "UserId is required"],
    },
     notificationType: {
        type: String,
        required:[true, "Notification type is required"]

     }
}.options);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;

