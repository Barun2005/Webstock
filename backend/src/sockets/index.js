let ioInstance;

const initSockets = (io) => {
  ioInstance = io;

  io.on('connection', (socket) => {
    console.log(`[Socket.IO] New client connected: ${socket.id}`);

    // Join a room (e.g., 'dashboard' for analytics updates)
    socket.on('join_dashboard', () => {
      socket.join('dashboard');
      console.log(`[Socket.IO] Client ${socket.id} joined 'dashboard' room`);
      socket.emit('status', { message: 'Connected to Real-Time Analytics Stream' });
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    });
  });
};

const getIO = () => {
  if (!ioInstance) {
    throw new Error('Socket.io not initialized!');
  }
  return ioInstance;
};

module.exports = { initSockets, getIO };
