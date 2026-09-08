import { serve } from '@hono/node-server';
import { app } from './app.js';
import { env } from './config/env.js';
import { pool } from './config/db.js';

const server = serve(
  {
    fetch: app.fetch,
    port: env.PORT,
  },
  (info) => {
    console.log(`🚀 Honocorp server running at http://localhost:${info.port}`);
    console.log(`📡 Environment: ${env.NODE_ENV}`);
  }
);

const gracefulShutdown = async (signal: string) => {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);
  try {
    server.close();
    await pool.end();
    console.log('Database pool connections closed.');
    process.exit(0);
  } catch (err) {
    console.error('Error during shutdown:', err);
    process.exit(1);
  }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

export default server;
