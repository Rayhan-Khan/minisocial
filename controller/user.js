import User from "../model/user.js";
import path from "path";
import multer from "multer";
import upload from "./fileUpload.js";
import jwt from "jsonwebtoken";
import removeFile from "../utils/uploadFileRemove.js";
import __dirname from "./path.js";
import notification from "../model/notification.js";
import follower from "../model/follower.js";
const up = upload.single("profile");
import isEmail from "validator/lib/isEmail.js";

function GenerateTokenAndCookie(data, status, message, res) {
  const token = jwt.sign({ data }, process.env.SECRET_KEY, {
    expiresIn: "30d",
  });
  return res
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000 - 2000),
    })
    .status(status)
    .json({ message: message, data });
}

export const Signin = async (req, res) => {
  let profilePicUrl;
  up(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ error: "multer error" });
    } else if (err) {
      return res.status(500).json({ error: "error" });
    }
    if (req.file) profilePicUrl = req.file.filename;
    const {
      Name: name,
      Email: email,
      Password: password,
      confirmPassword,
      userName,
    } = req.body;
    if (
      !isEmail(email) ||
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      !userName
    ) {
      if (profilePicUrl)
        removeFile(
          path.join(path.dirname(__dirname), "uploads/") + profilePicUrl
        );
      return res.status(202).json({ Message: "please provide valid data" });
    }
    const user = new User({
      name,
      email,
      password,
      confirmPassword,
      userName,
    });
    if (profilePicUrl) user.profilePicUrl = profilePicUrl;
    await user.save((err, data) => {
      if (data) {
        data.password = undefined;
        return GenerateTokenAndCookie(data, 201, "successfully created", res);
      } else {
        if (profilePicUrl)
          removeFile(
            path.join(path.dirname(__dirname), "uploads/") + profilePicUrl
          );
        if (err.code === 11000) {
          return res
            .status(409)
            .json({ message: "email or username alrady used,try new one" });
        }
        if (process.env.NODE_ENV == "development")
          return res.status(500).json({ message: err });
        return res.status(500).json({ message: "something wrong" });
      }
    });
    await notification({ user: user._id }).save();
    await follower({ user: user._id }).save();
    
  });
};

export const Login = async (req, res) => {
  const { Email: email, Password: password } = req.body;
  if (!email || !password)
    return res.status(401).send("please provide email or password");
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.ConfirmLogin(password, user.password)))
    return res.status(401).send("Email or password are wrong");
  user.password = undefined;
  const status = 200;
  const message = "successfully login";
  return GenerateTokenAndCookie(user, status, message, res);
};

export const Logout = async (req, res) => {
  await res.clearCookie("token");
  res.clearCookie('user')
  res.status(200).json({ message: "successfully logout" });
};

//valid username search
export const searchUserName = async (req, res) => {
  let userName = req.params.username;
  try {
    let found = !(await User.findOne({ userName }));
    res.status(200).json({ data: found });
  } catch (err) {
    return res.status(404).json({ Message: "Not Found" });
  }
};

export const searchText = async (req, res) => {
  try {
    const { searchText } = req.params;
    const userId=req.user.data._id;
    if (searchText.length === 0)
      return res.status(200).json({ message: "text empty" });
    let userPattern = new RegExp(`(${searchText})`);
    let user = await User.find({
      name: { $regex: userPattern, $options: "i" },
    }).select({name:1,profilePicUrl:1}).limit(20);
    const following=await follower.find({ user: userId }).select({following:1})
    return res.status(200).json({ data: user,following:following[0].following});
  } catch (err) {
    return res.status(500).json({ message: "server error" });
  }
};

export const totalUserNotification = async (req, res) => {
  try {
    const user = req.user.data._id;
    const totalNotification = await notification
      .findOne({ user, notifications: { unreadNotification: 1 } })
      .count({});
    res.status(200).json(totalNotification);
  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
};

export const getUserInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const userId=req.user.data._id;
    const user = await User.findOne({ _id:id }).select({name:1,userName:1,profilePicUrl:1});
    if (!user) {
      return res.status(404).send("No User Found");
    }
    const FollowStats = await follower.findOne({ user: id });
    const following=await follower.find({ user: userId }).select({following:1})
    return res.json({
      user,
      following:following[0].following,
      followersLength:FollowStats?.followers?.length,
      followingLength:FollowStats?.following?.length
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error");
  }
};
