import { pgTable, serial, text, integer } from 'drizzle-orm/pg-core';

export const positions = pgTable('positions', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  parentId: integer('parent_id'),
  
});
