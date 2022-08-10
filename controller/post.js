import Post from "../model/post.js";
import notification from "../model/notification.js";
import Follower from "../model/follower.js";
import mongoose from "mongoose";
import removeFile from "../utils/uploadFileRemove.js";
import multer from "multer";
import upload from "./fileUpload.js";
import path from "path";
import __dirname from "./path.js";
import { v4 as uuid } from "uuid";
import { notificionCreate } from "../utils/newLikeComentFollowerNotification.js";

const up = upload.single("picUrl");

/* -------------- */
export const getAllPost = async (req, res) => {
  const userId = req.user.data._id;
  const following = await Follower.findOne({ user: userId }).select({
    following: 1,
  });
  const obj = following.following.map((m) => m.user);
  obj.push(mongoose.Types.ObjectId(userId));
  const { pageNumber } = req.query;

  const number = Number(pageNumber);
  const size = 8;
  let posts;
  const skips = size * (number - 1);
  posts = await Post.find({ user: { $in: obj } })
    .skip(skips)
    .limit(size)
    .sort({ createdAt: -1 })
    .populate("user",{name:1,profilePicUrl:1})
    .populate("comments.user",{name:1,profilePicUrl:1});

  res.json(posts);
};

/* -------------- */
export const getUserPost = async (req, res) => {
  let { userId } = req.params;
  try {
    let user = mongoose.Types.ObjectId(userId);
    let post = await Post.find({ user })
      .sort({ createdAt: -1 })
      .populate("user", {
        _id: 1,
        name: 1,
        userName: 1,
        email: 1,
        profilePicUrl: 1,
      })
      .populate("comments.user", {
        _id: 1,
        name: 1,
        userName: 1,
        email: 1,
        profilePicUrl: 1,
      });
    if (!post) return res.status(200).json({ message: "no post found" });
    return res.status(200).json(post);
  } catch (err) {
    if (process.env.NODE_ENV.trim() === "development")
      return res.status(500).json({ errorgetUserPost: err });
    return res.status(500).json({ message: "server error" });
  }
};

/* -------------- */
export const createPost = async (req, res) => {
  up(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return res.status(500).json({ error: "multer error" });
    } else if (err) {
      // An unknown error occurred when uploading.
      return res.status(500).json({ error: "error" });
    }

    // Everything went fine.
    let picUrl;
    if (req.file) picUrl = req.file.filename;
    const { text } = req.body;
    if (!text && !picUrl) {
      removeFile(path.join(path.dirname(__dirname), "uploads/") + picUrl);
      return res.status(202).json({ Message: "please provide valid data" });
    }
    try {
      const post = new Post({ user: req.user.data._id });
      if (text) post.text = text;
      if (picUrl) post.picUrl = picUrl;
      const _post = await post.save();
      const sentCreatedpost = await Post.findById(_post._id).populate("user", {
        name: 1,
        email: 1,
        userName: 1,
        profilePicUrl: 1,
      });
      res.status(201).json(sentCreatedpost);
    } catch (error) {
      if (process.env.NODE_ENV) return res.status(500).json(error);
      res.status(500).json({ message: "internal error" });
    }
  });
};

/* -------------- */
export const updatePost = async (req, res) => {
  up(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return res.status(500).json({ error: "multer error" });
    } else if (err) {
      // An unknown error occurred when uploading.
      return res.status(500).json({ error: "error" });
    }

    // Everything went fine.
    let picUrl;
    if (req.file) picUrl = req.file.filename;
    const { text } = req.body;
    if (!text && !picUrl) {
      if (picUrl)
        removeFile(path.join(path.dirname(__dirname), "uploads/") + picUrl);
      return res.status(202).json({ Message: "please provide valid data" });
    }

    try {
      const _id = mongoose.Types.ObjectId(req.params.postId);
      const post = await Post.findById(_id);
      if (!post) return res.status(404).json({ message: "not found post" });
      if (post.user.toString() !== req.user.data._id) {
        console.log(post.user, loggedId);
        if (picUrl)
          removeFile(path.join(path.dirname(__dirname), "uploads/") + picUrl);
        return res.status(303).json({ message: "only update your post" });
      }
      if (text) post.text = text;
      if (picUrl) post.picUrl = picUrl;
      const _post = await post.save();
      const sentUpdatedpost = await Post.findById(_post._id).populate("user");
      res.status(201).json(sentUpdatedpost);
    } catch (error) {
      if (process.env.NODE_ENV.trim() === "development")
        return res.status(500).json(error);
      res.status(500).json({ message: "internal error" });
    }
  });
};
/* -------------- */
export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).send("post not found");
    }
    await notification.updateOne(
      { user: post.user },
      { $pullAll: { notifications: { post: post._id } } }
    );
    if (post.user.toString() !== req.user.data._id) {
      return res.status(401).send("Unauthorized");
    }

    if (post.picUrl)
      removeFile(path.join(path.dirname(__dirname), "uploads/") + post.picUrl);
    await post.remove();
    return res.status(200).send("Post deleted Successfully");
  } catch (err) {
    return res.status(500).json("server error");
  }
};
/* -------------- */
export const findeLikePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId).populate("likes.user", {
      _id,
      name,
      userName,
      email,
      profilePicUrl,
    });
    if (!post) {
      return res.status(404).send("No Post found");
    }

    return res.status(200).json(post.likes);
  } catch (error) {
    console.error(error);
    return res.status(500).send(`Server error`);
  }
};
/* -------------- */
export const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.data._id;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "no post found" });
    const isLike =
      post.likes.filter((like) => like.user.toString() === userId).length > 0;
    if (isLike) return res.status(401).send("Post already liked");

    await post.likes.unshift({ user: userId });
    await post.save();
    if (post.user.toString() !== userId)
      notificionCreate("newLike", userId, post._id, post.user);
    return res.status(200).json("Post liked");
  } catch (error) {
    console.error(error);
    return res.status(500).json(`Server error`);
  }
};

/* -------------- */
export const unlikePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.data._id;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "no post found" });
    const isLike =
      post.likes.filter((like) => like.user.toString() === userId).length === 0;
    if (isLike) return res.status(401).send("Post Not Like Before");

    await Post.updateOne(
      { _id: postId },
      { $pull: { likes: { user: userId } } }
    );
    if (post.user.toString() !== userId) {
      await notification.updateOne(
        { user: post.user },
        {
          $pull: {
            notifications: { type: "newLike", user: userId, post: post._id },
          },
        }
      );
    }

    return res.status(200).json("Unlike post");
  } catch (error) {
    console.error(error);
    return res.status(500).json(`Server error`);
  }
};

/* -------------- */
export const commentPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const userId = req.user.data._id;
    const { text } = req.body;

    if (text.length < 1)
      return res.status(401).send("Comment should be atleast 1 character");

    const post = await Post.findById(postId);

    if (!post) return res.status(404).send("Post not found");

    const newComment = {
      _id: uuid(),
      text,
      user: userId,
      date: Date.now(),
    };

    await post.comments.unshift(newComment);
    await post.save();

    if (post.user.toString() !== userId) {
      const userToNotify = await notification.findOne({ user: post.user });
      const newNotification = {
        type: "newComment",
        user: userId,
        post: postId,
        commentId: newComment._id,
        text,
        date: Date.now(),
      };

      await userToNotify.notifications.unshift(newNotification);
      await userToNotify.save();
    }

    return res.status(200).json({ message: "successfully commented" });
  } catch (error) {
    console.error(error);
    return res.status(500).send(`Server error`);
  }
};

/* -------------- */
export const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user.data._id;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).send("Post not found");

    const comment = post.comments.find((comment) => comment._id === commentId);
    if (!comment) {
      return res.status(404).send("No Comment found");
    }
    if (comment?.user.toString() !== userId) {
      return res.status(401).send("Unauthorized");
    }
    await Post.updateOne(
      {
        _id: postId,
      },
      { $pull: { comments: { _id: commentId, user: userId } } }
    );

    if (post.user.toString() !== userId) {
      await notification.updateOne(
        { user: post.user },
        { $pull: { notifications: { commentId, user: userId, post: postId } } }
      );
    }

    return res.status(200).send("Deleted Successfully");
  } catch (error) {
    console.error(error);
    return res.status(500).send(`Server error`);
  }
};
export const updateAllunreeadNotification = async (req, res) => {
  try {
    const user = req.user.data._id;
    await notification.updateMany(
      {
        user,
        "notifications.unreadNotification": 1,
      },
      { $set: { "notifications.$[].unreadNotification": 0 } }
    );
    res.json("updated");
  } catch (err) {
    res.status(500).json("server error");
  }
};
