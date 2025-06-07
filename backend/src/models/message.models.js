import mongoose from "mongoose";

const message = new mongoose.Schema({
    senderID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    recieverID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    text: {
        type: String,
    },
    image: {
        type: String
    },
    code: {
        type: String,
        default: "",
    }
},{timestamps: true});

const Message = mongoose.model("Message",message);
export default Message