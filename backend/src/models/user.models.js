import mongoose from "mongoose";

const userschema = mongoose.Schema({
    fullname:{
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true,
        unique:true
    },
    password: {
        type:String,
        required:true,
        minlength:8
    },
    profilepic: {
        type:String,
        default: ""
    },
    experience: [
        {
            url: {type: String},
            content: {type: String, required: true},
            from: {type:Date},
            to: {type:Date},
            title: {type: String, required: true},
            field: [{type: String}],
        }
    ],
    fields: [{type: String}]

},{timestamps:true})


const User = mongoose.model("User",userschema);
export default User;