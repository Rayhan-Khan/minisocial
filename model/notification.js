import mongoose from "mongoose";
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User",unique:true},
  notifications: [
    {
      type: {
        type: String,
        enum: ["newLike", "newComment", "newFollower"]
      },
      unreadNotification:{type:Number,default:1,index:true},
      user: { type: Schema.Types.ObjectId, ref: "User" },
      post: { type: Schema.Types.ObjectId, ref: "Post" },
      commentId: { type: String },
      text: { type: String },
      date: { type: Date, default: Date.now }
    }
  ]
});

export default mongoose.model("Notification", NotificationSchema);
