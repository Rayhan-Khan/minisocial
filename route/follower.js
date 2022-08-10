import { Router } from "express";
import { FindFollower, FindFollowing, startFolloing, unfollow } from "../controller/follower.js";

const router=Router();

router.get("/followers/:userId",FindFollower)
      .get("/following/:userId",FindFollowing)
      .post("/follow/:userToFollowId",startFolloing)
      .put("/unfollow/:userToUnfollowId",unfollow)

export default router;