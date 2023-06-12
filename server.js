const express=require('express')
const app=express();
const http=require ('http');
// const {Server} = require('socket.io');
const server=http.createServer(app);
// const io=new Server(server);

const socket = require("socket.io");
const io = socket(server, {
    cors: {
        origin: '*',
    }
});

const userSocketMap = {};

 function getALLConnectedClients(roomId){
    //map
    Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
        (socketId)=>{
     return {
        socketId,
        username:  userSocketMap[socketId],
     }
    });
 }
io.on('connection',(socket)  => {
    console.log('socket connected',socket.id);

    socket.on(ACTIONS.JOIN,({roomId,username}) => {
userSocketMap[socket.Id]=username;
socket.join(roomId);

const clients=getALLConnectedClients(roomId);
console.log(clients);
});
});
const PORT =process.env.PORT || 8000;
server.listen(PORT,()=> console.log(`Listening on port ${PORT}`));