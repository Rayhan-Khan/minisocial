import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    confirmPassword:{ 
      type: String, required: true,
      validate:{
        validator:function(el){
        return (el===this.password)},
          message:'Passwords are not the same'
    }
    },
    profilePicUrl: { type: String },
    userName:{type:String,requird:true,unique:true},
    unreadMessage:[{type:String}],
    unreadNotificationLike:[{type:String}],
    unreadNotificationComment:[{type:String}],
    unreadNotificationFollow:[{type:String}],
    role: { type: String, default: "user", enum: ["user", "admin"] },
    resetToken: { type: String },
    expireToken: { type: Date }
  },
  { timestamps: true }
);
UserSchema.pre('save',async function(next) {
   this.password = await bcrypt.hash(this.password, 12);   
   this.confirmPassword=undefined;
  next();
});

UserSchema.methods.ConfirmLogin=async function(reqPass,pass){
  return await bcrypt.compare(reqPass,pass);
}
export default mongoose.model("User", UserSchema);
