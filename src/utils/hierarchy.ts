import type { Position, PositionNode } from '../types/positionTypes.js';

// Function to add a new position into the right spot in the hierarchy
export const addPosition = (hierarchy: PositionNode[], newPosition: Position): PositionNode[] => {
    // If the new position has no parent, it's a root-level position
    if (newPosition.parent_id === null) {
        return [...hierarchy, { ...newPosition, children: [] }];
    }

    // Recursive function to insert the position into the correct parent's children[]
    const insertIntoChildren = (nodes: PositionNode[]): PositionNode[] => {
        return nodes.map((node) => {
            // If this node is the parent of the new position
            if (node.id === newPosition.parent_id) {
                return {
                    ...node,
                    children: [...(node.children || []), { ...newPosition, children: [] }],
                };
            }

            // If not, keep looking deeper in the hierarchy
            return {
                ...node,
                children: insertIntoChildren(node.children || []),
            };
        });
    };

    return insertIntoChildren(hierarchy);
};
