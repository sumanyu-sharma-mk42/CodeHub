import User from "../models/user.models.js";
import bcrypt from "bcrypt";
import { generatetoken } from "../utils/jwttoken.utils.js";
import cloudinary from "../utils/cloudinary.utils.js";
import { getFields } from "./mistral_api.controllers.js";

export const signup = async (req,res)=>{
    const {fullname,email,password} = req.body;
    try {
        if(!fullname || !email || !password){
            return res.status(400).json({message: "all feilds should be entered"})
        }
        if(password.length<8){
            return res.status(400).json({message: "password must be atleast 8 characters long"})
        }

        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({message: "user already exists"})
        }

        const salt = await bcrypt.genSalt(10);
        const hashpsswd = await bcrypt.hash(password,salt);

        const newuser = new User({
            fullname: fullname.toLowerCase(),  // storing the name in lower case for better searches
            email,
            password: hashpsswd
        })

        if(newuser){
            generatetoken(newuser._id,res);
            await newuser.save();
            res.status(201).json({
                _id: newuser._id,
                fullname: newuser.fullname,
                email: newuser.email,
                pss: hashpsswd,
                profilepic: newuser.profilepic,
                createdAt: newuser.createdAt,
                experience: newuser.experience,
                fields: newuser.fields,
            })
        }
        else{
            return res.status(400).json({message: "invalid user data"})
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "internal server error"})
    }
};
export const login = async (req,res)=>{
    const {email, password} = req.body;
    try{
        if(!email || !password){
            return res.status(400).json({message: "provide all the feilds"});
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message: "user doesn't exist"});
        }
        const valid = await bcrypt.compare(password,user.password);
        if(!valid){
            return res.status(400).json({message: "incorrect password"});
        }
        generatetoken(user._id,res);
        return res.status(200).json({
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            pss: user.password,
            profilepic: user.profilepic,
            createdAt: user.createdAt,
            experience: user.experience,
            fields: user.fields, 
        })
    }
    catch(error){
        res.status(500).json({message: `internal server error: ${error.message}`});
    }
};
export const logout = (req,res)=>{
    try{
        res.cookie("jwt","",{
            maxAge: 0,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.ENV_MODE !== "development",
            path: "/",  // Make sure path matches cookie path
        });
        res.status(200).json({message: "logged out successfully"});
    }
    catch(error){
        res.status(500).json({message: "internal server error"});
    }
};

export const update = async(req,res)=>{
    try{
        const {profilepic} = req.body;
        const userID = req.user._id;
        if(!profilepic){
            return res.status(400).json({message: "profile pic required"});
        }
        const cloudinary_res = await cloudinary.uploader.upload(profilepic);
        // secure url is something that the cloudinary provides
        // just hover on new to know what it does, it just return the new updated user, because by default it return the user before the update
        const update_user = await User.findByIdAndUpdate(userID, {profilepic: cloudinary_res.secure_url}, {new:true}).select("-password");
        res.status(200).json(update_user);
    }
    catch(error){
        res.status(500).json({message: "internal server error"});
        
    }
}

export const check = (req,res)=>{
    try {
        res.status(200).json(req.user);
    } catch (error) {
        res.status(500).json({message: "internal server error"});
    }
}

export const deleting = async (req,res)=>{
    const {index} = req.params;
    const userID = req.user._id;
    try {
        const user = await User.findById(userID);
        if(!user){
            return res.status(400).json({message: "invalid user"});
        }
        user.experience = user.experience.filter((_,i)=>i!=index)
        
        const allFields = new Set();
        user.experience.forEach(exp => {
        exp.field?.forEach(f => allFields.add(f));
        });
        user.fields = Array.from(allFields);

        await user.save();
        const userObj = user.toObject();
        delete userObj.password;

        res.status(200).json(userObj);
    } catch (error) {
        res.status(500).json({message: "internal server error"});
        
    }
}

export const adding = async (req,res)=>{
    try {
        const {from, to, title, content, url} = req.body;
        const userID = req.user._id;
        if(!title) return res.status(400).json({message: "Title is required "});
        if(!content) return res.status(400).json({message: "Content is required "});

        const field = await getFields(title + "\n" +content);

        const lowerCaseField = field.map(f => f.toLowerCase());
        const lowerCaseTitle = title.toLowerCase();


        const newExp = {from, to, title:lowerCaseTitle, content, url,field:lowerCaseField};
        const user = await User.findById(userID);

        if (!user) return res.status(404).json({ message: "User not found" });

        // Add newExp to user's experience array
        user.experience.push(newExp);

        // Merge new fields into user's fields array without duplicates
        field.forEach(f => {
        if (!user.fields.includes(f)) {
            user.fields.push(f);
        }
        });

        // Save updated user
        await user.save();

        // Remove password from response
        const userObj = user.toObject();
        delete userObj.password;

        res.status(200).json(userObj);
    } catch (error) {
        res.status(500).json({message: "internal server error"});
    }
}

export const edit = async (req,res)=>{
    const {from, to, title, content, url} = req.body;
    const {index} = req.params;
    const userID = req.user._id;
    try {
        if(!title) return res.status(400).json({message: "Title is required "});
        if(!content) return res.status(400).json({message: "Content is required "});

        const user = await User.findById(userID);
        const field = await getFields(title + "\n" +content);

        const lowerCaseField = field.map(f => f.toLowerCase());
        const lowerCaseTitle = title.toLowerCase();

        user.experience[index] = {from, to,title: lowerCaseTitle, content, url, field: lowerCaseField};

        // recompute the fields at the user level
        const allFields = new Set();
        user.experience.forEach(exp => {
        exp.field?.forEach(f => allFields.add(f));
        });
        user.fields = Array.from(allFields);

        await user.save();
        const userObj = user.toObject();
        delete userObj.password;

        res.status(200).json(userObj);
    }
    catch (error) {
        res.status(500).json({message: "internal server error"});
    }
}