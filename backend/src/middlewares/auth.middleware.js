import jwt from "jsonwebtoken";
import User from "../models/user.models.js";

export const protectroute = async(req,res,next)=>{
    try{
        const token = req.cookies.jwt;
        if(!token){
            console.log("sorry cant run you, no token");
            return res.status(401).json({message: "unauthorized"});
        }
        const decoder = jwt.verify(token, process.env.SECRET_KEY);
        if(!decoder){
            return res.status(401).json({message: "unauthorized"});
        }
        const user = await User.findById(decoder.userid).select("-password");
        if(!user){
            return res.status(401).json({message: "unauthorized"});
        }
        req.user = user;
        next();
    }
    catch(error){
        res.status(500).json({message: "internal server error"});
    }
}
