import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import positions from './routes/positions.js';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables


const app = new Hono();
app.use('*', cors());
app.route('/positions', positions);

serve({
  fetch: app.fetch,
  port: 3000,
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});
