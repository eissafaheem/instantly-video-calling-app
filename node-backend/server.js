const { Server } = require("socket.io")

const io = new Server(8000, {
    cors: true
})

io.on('connection', (socket) => {
    console.log("Socket connected ", socket.id)
    const socketId = socket.id;
    socket.on('join-room', (data) => {
        const { userId, roomId } = data;
        socket.join(roomId);
        socket.to(roomId).emit('join-room', { userId, socketId: socket.id });
    })

    socket.on('call-request', (data) => {
        const { offer, to } = data;
        socket.to(to).emit('call-incoming', { offer, from:socketId });
    })

    socket.on('call-answer', (data) => {
        const { ans, to } = data;
        console.log(data);
        socket.to(to).emit('call-answer', { ans })
    })
})