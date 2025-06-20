import jwt from "jsonwebtoken";

export const generatetoken = (userid,res)=>{
    const token = jwt.sign({userid},process.env.SECRET_KEY,{
        expiresIn: "7d",
    })

    res.cookie("jwt",token,{
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true, // prevent XSS attacks
        sameSite: "none", // prevent CSRF attacks
        secure: process.env.ENV_MODE!="development",
        path: "/",
    });
    console.log("JWT cookie set", { secure: process.env.ENV_MODE !== "development", sameSite: "none" });

} 