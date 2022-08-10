import Follower from "../model/follower.js";
import Notification from "../model/notification.js";

export const FindFollower = async (req, res) => {
  try {
    const id=req.user.data._id;
    const { userId } = req.params;
    const user = await Follower.findOne({ user: userId }).populate(
      "followers.user",
      {name:1,email:1,userName:1,profilePicUrl:1}
    );
    const following=await Follower.find({ user: id }).select({following:1})
    return res.status(200).json({user:user.followers,following:following[0].following});
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error");
  }
};

export const FindFollowing = async (req, res) => {
  try {
    const { userId } = req.params;
    const id=req.user.data._id;
    const user = await Follower.findOne({ user: userId }).populate(
      "following.user",
      {name:1,email:1,userName:1,profilePicUrl:1}
    );
    const following=await Follower.find({ user: id }).select({following:1})

    return res.status(200).json({user:user.following,following:following[0].following});
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error");
  }
};

export const startFolloing = async (req, res) => {
  try {
    const userId = req.user.data._id;
    const { userToFollowId } = req.params;
    const user = await Follower.findOne({ user: userId });
    const userToFollow = await Follower.findOne({ user: userToFollowId });

    if (!user || !userToFollow) {
      return res.status(404).send("User not found");
    }

    const isFollowing =
      user.following.length > 0 &&
      user.following.filter(
        (following) => following.user.toString() === userToFollowId
      ).length > 0;

    if (isFollowing) {
      return res.status(401).send("User Already Followed");
    }

    await user.following.unshift({ user: userToFollow.user });
    await user.save();

    await userToFollow.followers.unshift({ user: userId });
    await userToFollow.save();

    const notify = await Notification.findOne({ user:userToFollow.user});
    const newNotification = {
      type: "newFollower",
      user: userId,
      date: Date.now(),
    };
    await notify.notifications.unshift(newNotification);
    await notify.save();
    return res.status(200).send("Updated");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error");
  }
};

export const unfollow = async (req, res) => {
  try {
    const userId = req.user.data._id;
    const { userToUnfollowId } = req.params;

    const user = await Follower.findOne({
      user: userId,
    });

    const userToUnfollow = await Follower.findOne({
      user: userToUnfollowId,
    });

    if (!user || !userToUnfollow) {
      return res.status(404).send("User not found");
    }

    const isFollowing =
      user.following.length === 0 ||
      user.following.filter(
        (following) => following.user.toString() === userToUnfollowId
      ).length === 0;
    if (isFollowing) {
      return res.status(401).send("User Not Followed before");
    }
    await Follower.updateOne(
      { user: userId },
      { $pull: { following: { user: userToUnfollowId } } }
    );
    await Follower.updateOne(
      { user: userToUnfollowId },
      { $pull: { followers: { user: userId } } }
    );
    await Notification.updateOne({user:userToUnfollowId},{ $pull:{notifications:{type:'newFollower',user:userId}}})
    return res.status(200).send("Updated");
  } catch (error) {
    console.error(error);
    res.status(500).send("server error");
  }
};

