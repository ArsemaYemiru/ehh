export interface Position {
    id: number;
    name: string;
    parent_id: number | null;
    [x: string]: any;
}

export interface PositionNode extends Position {
    children?: PositionNode[];
}
