import Notification from "../model/notification.js";


export const notificionCreate=async(type,userId,postId,notifyId)=>{
try{
    const userToNotify = await Notification.findOne({ user: notifyId });
    const newNotification = {
        type,
        user: userId,
        post: postId,
        date: Date.now()
      };

    await userToNotify.notifications.unshift(newNotification);
    await userToNotify.save();
}catch(err){
    return res.status(500).json({message:'server error'})
}
}