import http from "http"
import express from "express"
import { Server } from "socket.io"

let app = express()

const server=http.createServer(app)
const io=new Server(server,{
    cors:{
        origin:https://realtimechatapp-fkty.onrender.com ,
        credentials: true

    }

})
 const userSocketMap={}
 export const getReceiverSocketId=(receiver)=>{
    return userSocketMap[receiver]
 }
io.on("connection",(socket)=>{
      const userId = socket.handshake.query.userId;

if (userId) {
  // remove previous socket of same user (IMPORTANT FIX)
  for (const [key, value] of Object.entries(userSocketMap)) {
    if (key === userId) {
      delete userSocketMap[key];
    }
  }

  userSocketMap[userId] = socket.id;
}

io.emit("getOnlineUsers", Object.keys(userSocketMap));
      })
    

    





export {app,server,io}
