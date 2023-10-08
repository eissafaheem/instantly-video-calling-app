const { Server } = require("socket.io")

const io = new Server(8000, {
    cors: true
})

io.on('connection', (socket) => {
    console.log("Socket connected ", socket.id)

    socket.on('join-room', (data) => {
        const { userId, roomId } = data;
        console.log(data);
        socket.join(roomId);
        socket.to(roomId).emit('join-room',{ userId, socketId: socket.id });
    })

    socket.on('call-request', (data)=>{
        console.log(data);
    })
})