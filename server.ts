import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { apiRouter } from './src/api-routes';

// Load environment configurations
dotenv.config({ path: '.env.local' });
dotenv.config();

async function startServer() {
  const app = express();

  // Attach API routes to Express
  app.use('/api', apiRouter);

  const isProduction = process.env.NODE_ENV === 'production' || process.env.VITE_PROD === 'true';
  const port = Number(process.env.PORT) || 3000;

  if (isProduction) {
    console.log('Serving production build from dist folder...');
    app.use(express.static(path.resolve('dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve('dist', 'index.html'));
    });
  } else {
    console.log('Starting Vite development server middleware...');
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`==================================================`);
    console.log(`🎮 RPG PORTFOLIO SERVER STARTED`);
    console.log(`➜ Mode:    ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);
    console.log(`➜ Local:   http://localhost:${port}/`);
    console.log(`➜ Host:    http://0.0.0.0:${port}/`);
    console.log(`==================================================`);
  });
}

startServer().catch((err) => {
  console.error('Server Initialization Failure:', err);
  process.exit(1);
});
