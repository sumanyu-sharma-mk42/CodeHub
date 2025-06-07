import mongoose from "mongoose";
import  {DB_NAME}  from "../constants.js";

const connectdb = async ()=>{
    try{
        const connectiondb = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        console.log(`connected ${connectiondb.connection.host}`);
    }
    catch(error){
        console.error("error: ",error)
    }
}

export default connectdb;