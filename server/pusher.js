const express = require('express');
const Pusher = require('pusher');
const http = require("http");
const { Server } = require("socket.io");
const app = express();

const pusher = new Pusher({
    appId: '1779899',
    key: 'bceed63955706d81d606',
    secret: '093514c0fabef91d1b3e',
    cluster: 'mt1',
    useTLS: true // Enable HTTPS
  });

  const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: [
            'https://versed-yard.surge.sh',
            'http://localhost:5173'
        ],
        credentials: true,
        methods: ["GET", "POST"],
    },
});

io.on("connect", (socket) => {
    console.log(`Socket Connected: ${socket.id}`); 


    socket.on('join-room', (roomId, id) => {
        console.log(`User ${id} is joining room ${roomId}`);
        socket.join(roomId);
        socket.broadcast.to(roomId).emit('user-connected', id);
    });

    socket.on('user-toggled-audio', (id, roomId) => {
      console.log(`User ${id} toggled audio in room ${roomId}`);
      socket.join(roomId); 
      socket.broadcast.to(roomId).emit('user-toggled-audio', id); 
  });
    socket.on('user-toggled-video', (id, roomId) => {
        console.log(`User ${id} toggled video in room ${roomId}`);
        socket.join(roomId);
        socket.broadcast.to(roomId).emit('user-toggled-video', id);
    });

    socket.on('user-leave', (id, roomId) => {
        console.log(`User ${id} left room ${roomId}`);
        socket.join(roomId);
        socket.broadcast.to(roomId).emit('user-leave', id);
    });

    socket.on('disconnect', () => {
        console.log(`Socket Disconnected: ${socket.id}`); // Log when a socket disconnects
    });
});

  app.get('/', (req, res) => {
    res.send('Hello World!');
  });
  
  // Trigger an event
  app.post('/trigger-event', (req, res) => {
    pusher.trigger('my-channel', 'my-event', {
      message: 'hello world'
    });
    res.send('Event triggered successfully!');
  });
  
  // Start the server
  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, 'localhost', () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
