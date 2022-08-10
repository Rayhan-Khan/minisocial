import { Router } from "express";
import {
  getUserInfo,
  searchText,
  totalUserNotification,
} from "../controller/user.js";
import { searchUserName } from "../controller/user.js";
import { Login, Logout, Signin } from "../controller/user.js";
import authUser from "../middleware/authUser.js";

const router = Router();
router
  .post("/login", Login)
  .post("/signin", Signin)
  .post("/logout", authUser, Logout)
  .get("/search/:username", searchUserName)
  .get("/searchText/:searchText", authUser, searchText)
  .get("/totalnotificationunread", authUser, totalUserNotification)
  .get("/:id", authUser, getUserInfo);

export default router;
