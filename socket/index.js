let users = [];

const addUser = (userId, socketId) => {
    let index = users.findIndex(item => item.userId === userId);
    index !== -1 ? users.splice(index, 1, {userId, socketId}) : users.push({userId, socketId});
}

const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId);
}

const getUser = userId => {
    return users.find(user => user.userId === userId)
}

module.exports = (io) => {
    io.on('connection', socket => {
        console.log('A user connected: '+`${socket.id}`);

        socket.on('addUser', userId => {
            addUser(userId, socket.id);
            io.emit('getUsers', users);
        });
    
        socket.on('disconnect', () => {
            console.log('A user disconnected');
            removeUser(socket.id);
            io.emit('getUsers', users);
        });

        // Handle event from client
        socket.on('sendMessage', ({senderId, reseiverId, text, date}) => {
            const user = getUser(reseiverId);
            if (user){
                io.to(user.socketId).emit('getMessage', {
                    senderId, text, date
                });
            }
        });

        socket.on('sendChat', ({ userId, roomId, message, receiverId, date }) => {
            const user = getUser(receiverId);
            if (user){
                io.to(user.socketId).emit('getChat', {
                    userId, roomId, message, date
                });
            }
            
        });
    });
}