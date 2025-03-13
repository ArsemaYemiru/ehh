import type { Position, PositionNode } from '../types/positionTypes.js';
export const addPosition = (hierarchy: PositionNode[], newPosition: Position): PositionNode[] => {
    if (newPosition.parent_id === null) {
        return [...hierarchy, { ...newPosition, children: [] }];
    }

    const insertIntoChildren = (nodes: PositionNode[]): PositionNode[] => {
        return nodes.map((node) => {
            if (node.id === newPosition.parent_id) {
                return {
                    ...node,
                    children: [...(node.children || []), { ...newPosition, children: [] }],
                };
            }
            return {
                ...node,
                children: insertIntoChildren(node.children || []),
            };
        });
    };

    return insertIntoChildren(hierarchy);
};
export function buildHierarchy(positions: Position[]): PositionNode[] {
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
