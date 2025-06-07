import dotenv from "dotenv";
import connectdb from "./db/index.js";
import app from "./app.js";
import { server } from "./utils/socket.js";
dotenv.config();

connectdb()
.then(()=>{
    server.listen(process.env.PORT || 4000,()=>{
        console.log("listening...");
    })
})
.catch((error)=>{
    console.error("error: ",error);
})