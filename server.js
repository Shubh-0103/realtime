const express = require('express');
const app = express();
const http = require('http');
const path = require("path")
// const {Server} = require('socket.io');
const server = http.createServer(app);
const ACTIONS = require("./src/Actions")
// const io=new Server(server);

app.use(express.static(__dirname+'/build'));
app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname+'/build/index.html'))
})

const socket = require("socket.io");
const io = socket(server, {
    cors: {
        origin: '*',
    }
});

const userSocketMap = {};

function getALLConnectedClients(roomId) {
    //map
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
        (socketId) => {
            return {
                socketId,
                username: userSocketMap[socketId],
            }
        });
}
io?.on('connection', (socket) => {
    socket?.on(ACTIONS.JOIN, ({ roomId, username }) => {
        userSocketMap[socket.id] = username;
        socket.join(roomId);

        const clients = getALLConnectedClients(roomId);
        clients?.forEach( ({socketId}) => {
              io.to(socketId).emit(ACTIONS.JOINED ,{
                clients,
                username,
                socketId: socket.id,
              });
        } )
    });
socket?.on(ACTIONS.CODE_CHANGE,({roomId,code})=>{
    //emitting data froms server
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE,{code});
});
socket?.on(ACTIONS.SYNC_CODE,({socketId,code})=>{
    //emitting data froms server
    io.to(socketId).emit(ACTIONS.CODE_CHANGE,{code});
});

    socket?.on('disconnected',({roomId}) =>{
        const clients = getALLConnectedClients(roomId);
        clients?.forEach( ({socketId}) => {
              io.to(socketId).emit(ACTIONS.DISCONNECTED,{
               socketId : socket.id,
               username:userSocketMap[socket.id],  
            }); 
        });
        // this is used for removing a client from everywhree
        delete userSocketMap[socket.id];
        socket.leave();
    })
});
const PORT = process.env.PORT || 9000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));