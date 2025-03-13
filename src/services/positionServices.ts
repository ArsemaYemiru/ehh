import { db } from '../db/index.js'; 
import { positions as positionSchema } from '../db/schema.js';
import type { Position, PositionNode } from '../types/positionTypes.js';
import { eq } from "drizzle-orm";

export class PositionService {
  // Fetch all positions from the database
  async getAllPositions(): Promise<PositionNode[]> {
    const result = await db.execute(`SELECT * FROM positions;`);
    const positions: Position[] = result.rows as unknown as Position[];
    return this.buildHierarchy(positions);
  }
  

  // Recursive tree builder
  private buildHierarchy(positions: Position[]): PositionNode[] {
    const positionMap: Record<number, PositionNode> = {};
    const rootPositions: PositionNode[] = [];

    positions.forEach(({ id, name, parent_id }) => {
      positionMap[id] = { id, name, parent_id, children: [] };
    });

    positions.forEach(({ id, parent_id }) => {
      if (parent_id !== null && positionMap[parent_id]) {
        positionMap[parent_id].children?.push(positionMap[id]);
      } else {
        rootPositions.push(positionMap[id]);
      }
    });

    return rootPositions;
  }

  // Fetch a position by ID
  async getPositionById(id: number): Promise<Position | null> {
    const [positions] = await db
      .select()
      .from(positionSchema)
      .where(eq(positionSchema.id, id)).limit(1)
      .execute();
    return positions;
  }

  // Insert a new position
  async createPosition(name: string, parent_id: number | null){
    const [result] = await db
      .insert(positionSchema)
      .values({ name, parentId: parent_id })
      .returning({
        id: positionSchema.id,
        name: positionSchema.name,
        parentId: positionSchema.parentId
      })
      .execute();
    return result;
  }

  // Update an existing position
  async updatePosition(id: number, name: string, parent_id: number | null): Promise<Position | null> {
    const [result] = await db
      .update(positionSchema)
      .set({ name, parentId: parent_id })
      .where(eq(positionSchema.id, id))
      .returning({
        id: positionSchema.id,
        name: positionSchema.name,
        parentId: positionSchema.parentId
      })
      .execute();
    return result ? { ...result, parent_id: result.parentId } : null;
  }

  // Delete a position
  async deletePosition(id: number): Promise<boolean> {
    const result = await db
      .delete(positionSchema)
      .where(eq(positionSchema.id, id))
      .returning({ id: positionSchema.id })
      .execute();
    return result.length > 0;
  }
}
