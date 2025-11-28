import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

import config from './config';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware';
import { setSocketIO } from './controllers/webhookController';

const app: Express = express();
const httpServer = createServer(app);

// Socket.IO setup
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: config.cors.origin,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
});

// Set Socket.IO instance for webhook controller
setSocketIO(io);

// Middleware
app.use(helmet({
  contentSecurityPolicy: config.nodeEnv === 'production' ? undefined : false,
}));
app.use(cors(config.cors));
app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'SMS Receiver API',
    version: '1.0.0',
    docs: '/api-docs',
  });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`[Socket] Client connected: ${socket.id}`);

  socket.on('subscribe', ({ phoneNumberId }: { phoneNumberId: string }) => {
    socket.join(`phone:${phoneNumberId}`);
    console.log(`[Socket] Client ${socket.id} subscribed to phone:${phoneNumberId}`);
  });

  socket.on('unsubscribe', ({ phoneNumberId }: { phoneNumberId: string }) => {
    socket.leave(`phone:${phoneNumberId}`);
    console.log(`[Socket] Client ${socket.id} unsubscribed from phone:${phoneNumberId}`);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket] Client disconnected: ${socket.id}`);
  });
});

// Start server
httpServer.listen(config.port, () => {
  console.log(`[Server] Running on port ${config.port} in ${config.nodeEnv} mode`);
  console.log(`[Server] API: http://localhost:${config.port}/api`);
  console.log(`[Server] Health: http://localhost:${config.port}/api/health`);
});

export { app, httpServer, io };
