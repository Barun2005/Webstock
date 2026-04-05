const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const { initSockets } = require('./sockets');
const config = require('./config');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

// Create HTTP server wrapping the Express app
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*', // To be restricted to the frontend URL in production
    methods: ['GET', 'POST']
  }
});

const { startMetricsBroadcaster } = require('./services/analyticsService');

// Setup Socket events
initSockets(io);

// Start emitting live aggregated statistics to Dashboard WebSockets
startMetricsBroadcaster();

// Start listening
server.listen(config.port, () => {
  console.log(`====================================`);
  console.log(`🚀 Server started on port ${config.port}`);
  console.log(`🔌 WebSockets enabled and listening`);
  console.log(`====================================`);
});
