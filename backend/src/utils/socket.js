import {Server} from 'socket.io';
import express from 'express';
import http from 'http';

const app = express();
const server = http.createServer(app);

const io = new Server(server,{
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true,
    }
})

export const getRecieverSocketId = (userID)=>{
    return userSocketMap[userID];
}

const userSocketMap = {}; // Even if a user reloads the page (causing a new socket connection), Their entry in userSocketMap gets overwritten with the latest socket.id.
const roomUserMap = {};
io.on("connection",(socket)=>{
    console.log("connected to: ", socket.id);

    const userID = socket.handshake.query.userID;
    if(userID) userSocketMap[userID] = socket.id;

    io.emit("getOnlineUsers",Object.keys(userSocketMap)); // broadcast the event to all the clients as an array of user_ids


    socket.on("join_room",(sessionid,user)=>{   // server listens for anyone joining the room
        
        console.log(user);
        socket.join(sessionid);

        if (!roomUserMap[sessionid]) {
            roomUserMap[sessionid] = [];
        }
    
        // Check if user is already added (avoid duplicates)
        const alreadyExists = roomUserMap[sessionid].some(u => u._id === user._id);
        if (!alreadyExists) {
            roomUserMap[sessionid].push(user);
        }
        io.to(sessionid).emit("onlineuser", roomUserMap[sessionid]);; // sends online users as sson as someone joins the editor
    })

    socket.on("code_change",(session)=>{      // server listen if any socket changes the code
        const sessionid = session.sessionID;
        socket.to(sessionid).emit("code_change",session);
    })

    socket.on("code_save",(session,isSaving)=>{     // server lsitens if anyone saves the code
        const sessionid = session.sessionID;
        socket.to(sessionid).emit("code_save",isSaving);  // broadcast to all the clients except for the sender
    })

    socket.on("editorUserLeft",(sessionid,user)=>{
        socket.leave(sessionid);

        roomUserMap[sessionid] = roomUserMap[sessionid].filter(
            (u) => u._id !== user._id
        );
        io.to(sessionid).emit("onlineuser", roomUserMap[sessionid]);
        
        console.log("disconnected from the editor: ",socket.id);
    })

    socket.on("disconnect",()=>{
        const editorUser = userID;
        delete userSocketMap[userID];
        io.emit("getOnlineUsers",Object.keys(userSocketMap));
        for (const sessionId in roomUserMap) {
            roomUserMap[sessionId] = roomUserMap[sessionId].filter(
                (u) => u._id !== editorUser
            );
            io.to(sessionId).emit("onlineuser", roomUserMap[sessionId]);
        }
        console.log("disconnected: ",socket.id);
    })
})

export {app, io, server};