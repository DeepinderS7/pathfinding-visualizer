export type AlgorithmType = "DIJKSTRA" | "ASTAR" | "BFS" | "DFS";

export interface AlgoritmSelectType {
  name: string;
  value: AlgorithmType;
}

export type MazeType = "NONE" | "BINARY_TREE" | "RECURCIVE_DIVISION";

export interface MazeSelectType {
  name: string;
  value: MazeType;
}

export type TileType = {
  row: number;
  col: number;
  isEnd: boolean;
  isWall: boolean;
  isPath: boolean;
  isStart: boolean;
  distance: number;
  isTraversed: boolean;
  parent: TileType | null;
};

export type GridType = TileType[][];

export type SpeedType = 0.5 | 1 | 2;

export interface SpeedSelectType {
  name: string;
  value: SpeedType;
}
