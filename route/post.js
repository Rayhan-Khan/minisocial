import { Router } from "express";
import {
  commentPost,
  createPost,
  deleteComment,
  deletePost,
  findeLikePost,
  getAllPost,
  getUserPost,
  likePost,
  unlikePost,
  updateAllunreeadNotification,
  updatePost,
} from "../controller/post.js";

const router = Router();

router
  .get("/all/post", getAllPost)
  .get("/post/:userId", getUserPost)
  .post("/post", createPost)
  .put("/post/:postId", updatePost)
  .delete("/post/:postId", deletePost)
   .get('/like/:postId',findeLikePost)
  .post("/like/:postId", likePost)
  .put("/unlike/:postId", unlikePost)
  .post("/coment/:postId", commentPost)
  .delete("/comment/:postId/:commentId", deleteComment)
  .put('/unreadnotification',updateAllunreeadNotification);

export default router;
