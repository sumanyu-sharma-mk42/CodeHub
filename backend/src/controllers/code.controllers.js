import CodeSession from "../models/codeSession.models.js";
import { generateID } from "../utils/generateID.js";



export const getSession = async (req,res)=>{
    const { sessionid : sessionID } = req.params;

    try {
        const session = await CodeSession.findOne({ sessionID });

        if (!session) return res.status(404).json({ message: "Session not found" });
        
        res.status(200).json(session);
    } catch (error) {
        console.error("Error fetching session:", error);
        res.status(500).json({ message: "Internal server error" });
    }
} // to get the session from the db whent he user accesses the editor component


export const createSession = async (req,res)=>{
    const userID = req.user._id;
    const {id: reciever} = req.params;
    const sessionID = await generateID();
    try {
        const newSession = new CodeSession({
            sessionID,
            senderID: userID,
            recieverID: reciever,
        })
        await newSession.save();
        res.status(200).json(newSession);
    } catch (error) {
        res.status(500).json({message: "internal server error"});
    }
} // when the sender creates a session then in the db it is added using this

export const saveChanges = async (req,res)=>{
    const {title, content, language} = req.body;
    const {sessionid: sessionID} = req.params;
    try {
        const session = await CodeSession.findOneAndUpdate(
            { sessionID }, // Find session by sessionId
            { $set: { title,content,language } },
            { new: true, upsert: false } // Return updated doc, don't create if not found
        );

        if (!session) return res.status(404).json({ message: "Session not found" });
            
        res.status(200).json(session);
    } catch (error) {
        res.status(500).json({message: "internal server error"});
    }
} // when the user clicks the save button on the editor