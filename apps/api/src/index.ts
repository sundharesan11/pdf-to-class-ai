import Fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import { authenticateRequest, requireRole, AuthenticatedRequest } from './middleware/auth.js';
import { authRoutes } from './routes/auth.routes.js';
import { pdfRoutes } from './routes/pdf.routes.js';
import { classesRoutes } from './routes/classes.routes.js';
import { sessionsRoutes } from './routes/sessions.routes.js';
import { chatRoutes } from './routes/chat.routes.js';

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const HOST = process.env.HOST || '0.0.0.0';

const fastify = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
  },
});

// Register plugins
await fastify.register(cors, {
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true,
});

await fastify.register(multipart, {
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB
  },
});

// Decorators for auth
fastify.decorate('authenticate', authenticateRequest);
fastify.decorate('requireTeacher', async (request: AuthenticatedRequest, reply: any) => {
  await requireRole(['teacher'], request, reply);
});
fastify.decorate('requireStudent', async (request: AuthenticatedRequest, reply: any) => {
  await requireRole(['student'], request, reply);
});

// Health check
fastify.get('/health', async (request, reply) => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// API routes
await fastify.register(authRoutes, { prefix: '/api/auth' });
await fastify.register(pdfRoutes, { prefix: '/api/pdf' });
await fastify.register(classesRoutes, { prefix: '/api/classes' });
await fastify.register(sessionsRoutes, { prefix: '/api/sessions' });
await fastify.register(chatRoutes, { prefix: '/api/chat' });

// Root route
fastify.get('/', async (request, reply) => {
  return {
    name: 'EduAgent API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      pdf: '/api/pdf',
      classes: '/api/classes',
      sessions: '/api/sessions',
      chat: '/api/chat',
    },
  };
});

// Error handler
fastify.setErrorHandler((error, request, reply) => {
  fastify.log.error(error);
  
  reply.status(error.statusCode || 500).send({
    success: false,
    error: error.message || 'Internal server error',
  });
});

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: PORT, host: HOST });
    console.log('');
    console.log('🚀 EduAgent API Server Started!');
    console.log('');
    console.log(`   ➜ Local:    http://localhost:${PORT}`);
    console.log(`   ➜ Network:  http://${HOST}:${PORT}`);
    console.log('');
    console.log('📚 Available endpoints:');
    console.log('   ➜ Health:    GET  /health');
    console.log('   ➜ Auth:      POST /api/auth/register, /api/auth/login');
    console.log('   ➜ PDF:       POST /api/pdf/upload');
    console.log('   ➜ Classes:   GET  /api/classes, POST /api/classes/join');
    console.log('   ➜ Sessions:  POST /api/sessions/start, POST /api/sessions/:id/continue');
    console.log('   ➜ Chat:      POST /api/chat/message');
    console.log('');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  console.log(`\n${signal} received, closing server gracefully...`);
  await fastify.close();
  console.log('Server closed');
  process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
