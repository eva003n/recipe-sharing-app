import mongoose from "mongoose";

const followerSchema = mongoose.Schema({
  followerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  //person being followed
  followeeId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});
const Follow = mongoose.model("Follow", followerSchema);

export default Follow;
