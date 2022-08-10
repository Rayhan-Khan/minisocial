
import jwt from "jsonwebtoken";
export default async function (req,res,next){
    try{
        let token=req.cookies.token; 
        const data=jwt.verify(token, process.env.SECRET_KEY);
        if(req.body.isLoggedin) 
         return res.status(200).json({user:data});
        req.user= data;
    }catch(error){
        await res.clearCookie("token");
        return  res.status(303).json({message:'Please logged in first'});;
    }
    next()
}



