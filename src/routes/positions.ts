import { Hono } from 'hono';
import { PositionService } from '../services/positionServices.js';
import { db } from '../db/index.js';

const positions = new Hono();
const positionService = new PositionService();

// Fetch positions and return as a hierarchy
positions.get('/', async (c) => {
  try {
    const positions = await positionService.getAllPositions();
    return c.json(positions, 200);
  } catch (error) {
    console.error('Error in GET /positions:', error);
    return c.json({ error: 'Error fetching positions' }, 500);
  }
});

// Create a new position
positions.post('/', async (c) => {
  const { name, parent_id } = await c.req.json();
  if (!name) return c.json({ error: 'Position name is required' }, 400);

  try {
    const result = await positionService.createPosition(name, parent_id || null);
    return c.json(result, 201);
  } catch (error) {
    console.error('Error in POST /positions:', error);
    return c.json({ error: 'Error creating position' }, 500);
  }
});

// Update a position
positions.put('/:id', async (c) => {
  const id = parseInt(c.req.param('id'), 10);
  const { name, parent_id } = await c.req.json();

  try {
    const result = await positionService.updatePosition(id, name, parent_id || null);
    if (!result) return c.json({ error: 'Position not found' }, 404);
    return c.json(result);
  } catch (error) {
    console.error('Error in PUT /positions/:id:', error);
    return c.json({ error: 'Error updating position' }, 500);
  }
});

// Delete a position
positions.delete('/:id', async (c) => {
  const id = parseInt(c.req.param('id'), 10);

  try {
    const success = await positionService.deletePosition(id);
    if (!success) return c.json({ error: 'Position not found' }, 404);
    return c.json({ message: 'Position deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /positions/:id:', error);
    return c.json({ error: 'Error deleting position' }, 500);
  }
});

// RPC Endpoint for Calling DB Functions
positions.post('/rpc/:functionName', async (c) => {
  const functionName = c.req.param('functionName');
  const params: any[] = await c.req.json(); // Expect an array of parameters

  try {
    // Dynamically construct parameter placeholders: $1, $2, $3, etc.
    const placeholders = params.map((_, i) => `$${i + 1}`).join(', ');
    const query = `SELECT * FROM ${functionName}(${placeholders})`;
    const result = await db.execute(query, params);
    return c.json(result);
  } catch (error) {
    console.error(`Error calling RPC function ${functionName}:`, error);
    return c.json({ error: 'RPC call failed' }, 500);
  }
});

export default positions;
