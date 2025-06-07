import Message from "../models/message.models.js";
import User from "../models/user.models.js"
import cloudinary from "../utils/cloudinary.utils.js";
import { getRecieverSocketId, io } from "../utils/socket.js";

export const getUserForSidebar = async (req,res)=>{
    try {
        const loggedInUser = req.user._id;
        const filteredUsers = await User.find({_id: {$ne: loggedInUser}}).select("-password"); // find everyone except the logged-in user
        res.status(200).json(filteredUsers); 
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "internal server error"});
    }
}

export const getMessages = async (req,res)=>{
    try {  
        const {id: other_person} = req.params;
        const myid = req.user._id;
        const messages = await Message.find({
            $or:[
                {senderID: myid , recieverID: other_person},
                {senderID: other_person , recieverID: myid}
        ]})
        res.status(200).json(messages);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "internal server error"});
    }
}

export const sendMessages = async (req,res)=>{
    try {
        const myid = req.user._id;
        const {text, image, code} = req.body;
        const {id: reciever} = req.params;
        let imgurl;
        if(image){
            const cloudinary_res = await cloudinary.uploader.upload(image);
            imgurl = cloudinary_res.secure_url;
        }
        const newmessage = new Message({
            senderID: myid,
            recieverID: reciever,
            text,
            image: imgurl,
            code: code,
        })
        await newmessage.save();
        const recieverSocketID = getRecieverSocketId(reciever);
        if(recieverSocketID){
            io.to(recieverSocketID).emit("newmessage",newmessage);
        }

        res.status(200).json(newmessage);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "internal server error"});
    }
}

export const searchUsers = async (req,res)=>{
    const { query, type } = req.query;

    if (!query) return res.status(400).json({ message: "Query is required" });

    try {
    let pipeline;

    if (type === "live") {
        // 🔍 LIVE SEARCH — Autocomplete only (used while typing)
        pipeline = [
        {
            $search: {
            index: "user_search_index",
            compound: {
                should: [
                {
                    autocomplete: {
                    query,
                    path: "fullname",
                    fuzzy: { maxEdits: 1 }
                    }
                },
                {
                    autocomplete: {
                    query,
                    path: "fields",
                    fuzzy: { maxEdits: 1 }
                    }
                },
                {
                    autocomplete: {
                    query,
                    path: "experience.title",
                    fuzzy: { maxEdits: 1 }
                    }
                }
                ]
            }
            }
        },
        { $limit: 10 }
        ];
    } else if (type === "final") {
        // 🔎 FINAL SEARCH — Autocomplete + Text
        pipeline = [
        {
            $search: {
            index: "user_search_index",
            compound: {
                should: [
                {
                    autocomplete: {
                    query,
                    path: "fullname",
                    fuzzy: { maxEdits: 1 }
                    }
                },
                {
                    autocomplete: {
                    query,
                    path: "fields",
                    fuzzy: { maxEdits: 1 }
                    }
                },
                {
                    autocomplete: {
                    query,
                    path: "experience.title",
                    fuzzy: { maxEdits: 1 }
                    }
                },
                {
                    text: {
                    query,
                    path: ["fullname", "fields", "experience.title"],
                    fuzzy: { maxEdits: 1 }
                    }
                }
                ]
            }
            }
        },
        { $limit: 20 }
        ];
    } else {
        return res.status(400).json({ message: "Invalid type" });
    }

    const results = await User.aggregate(pipeline);
    const finalResult = results.map(f=>{delete f.password; return f;});
    res.status(200).json(finalResult);

    } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Server error" });
    }

    
}