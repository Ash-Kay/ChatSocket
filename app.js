const express = require('express'),
http = require('http'),
app = express(),
server = http.createServer(app),
io = require('socket.io').listen(server),
port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Chat Server is running on port '+port)
});

io.on('connection', (socket) => {
    console.log('user connected')

    socket.on('join-room', function(roomId) {
        console.log(roomId +" : has been joined by someone"  );
        io.to(roomId).emit(" someone joined ")
    })

    socket.on('join', function(userNickname) {
        console.log(userNickname +" : has joined the chat "  );
        socket.broadcast.emit('userjoinedthechat',userNickname +" : has joined the chat server ");
    })

    socket.on('messagedetection', (senderNickname,messageContent,roomId) => {
        console.log(senderNickname+" : " +messageContent)
        let  message = {"message":messageContent, "senderNickname":senderNickname}
        io.to(roomId).emit('message', message )
    })

    socket.on('disconnect', function() {
        console.log('someone has left ')
        socket.broadcast.emit( "userdisconnect" ,' user has left')
    })

})

server.listen(port,()=>{
    console.log('Node app is running on port '+port)
})
