import mongoose from 'mongoose';

const codeSessionSchema = new mongoose.Schema({
    sessionID: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        default: "Untitled",
    },
    language: {
        type: String,
        default:"javascript",
        required: true,
    },
    content: {
        type: String,
        default: "",
    },
    senderID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true,
    },
    recieverID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true,
    }
},{timestamps:true});

const CodeSession = mongoose.model("CodeSession",codeSessionSchema);
export default CodeSession;