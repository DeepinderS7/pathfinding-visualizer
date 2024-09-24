import { MAX_COLS, MAX_ROWS, SPEEDS, TILE_STYLE } from "./constants";
import { GridType, SpeedType, TileType } from "./types";

const createRow = (row: number, startTile: TileType, endTile: TileType) => {
  const currentRow: TileType[] = [];
  for (let col = 0; col < MAX_COLS; col++) {
    currentRow.push({
      row,
      col,
      isStart: row == startTile.row && col == startTile.col,
      isEnd: row == endTile.row && col == endTile.col,
      isPath: false,
      isWall: false,
      distance: Infinity,
      parent: null,
      isTraversed: false,
    });
  }
  return currentRow;
};

export const createGrid = (startTile: TileType, endTile: TileType) => {
  const grid: GridType = [];
  for (let row = 0; row < MAX_ROWS; row++) {
    grid.push(createRow(row, startTile, endTile));
  }
  return grid;
};

export const createNewGrid = (grid: GridType, row: number, col: number) => {
  const newGrid = grid.slice();
  const newTile = {
    ...newGrid[row][col],
    isWall: !newGrid[row][col].isWall,
  };

  newGrid[row][col] = newTile;
  return newGrid;
};

export const resetGrid = ({ grid }: { grid: GridType }) => {
  for (let row = 0; row < MAX_ROWS; row++) {
    for (let col = 0; col < MAX_COLS; col++) {
      const tile = grid[row][col];
      tile.distance = Infinity;
      tile.isTraversed = false;
      tile.isPath = false;
      tile.parent = null;
      tile.isWall = false;

      if (!tile.isStart && !tile.isEnd) {
        const tileElement = document.getElementById(
          `tile-${tile.row}-${tile.col}`
        );

        if (tileElement) {
          tileElement.className = TILE_STYLE;
        }

        if (tile.row === MAX_ROWS - 1) {
          tileElement?.classList.add("border-b");
        }

        if (tile.col === 0) {
          tileElement?.classList.add("border-l");
        }
      }
    }
  }
};

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const destroyWall = async (
  grid: GridType,
  row: number,
  col: number,
  isRight: number,
  speed: SpeedType
) => {
  if (isRight && grid[row][col + 1]) {
    grid[row][col + 1].isWall = false;
    document.getElementById(`tile-${row}-${col + 1}`)!.className = TILE_STYLE;
    await sleep(20 * SPEEDS.find((s) => s.value === speed)!.value - 5);
  } else if (grid[row + 1]) {
    grid[row + 1][col].isWall = false;
    document.getElementById(`tile-${row + 1}-${col}`)!.className = TILE_STYLE;
    await sleep(20 * SPEEDS.find((s) => s.value === speed)!.value - 5);
  } else {
    grid[row][col].isWall = false;
    document.getElementById(`tile-${row}-${col}`)!.className = TILE_STYLE;
    await sleep(20 * SPEEDS.find((s) => s.value === speed)!.value - 5);
  }
};

export const getRandInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.ceil(max);
  const randInt = Math.floor(Math.random() * (max - min) + min);
  // console.log(randInt);
  return randInt;
};

export const isEqual = (a: TileType, b: TileType) => {
  return a.row === b.row && a.col === b.col;
};

export const isRowColEqual = (row: number, col: number, tile: TileType) => {
  return row === tile.row && col === tile.col;
};

export function isInQueue(tile: TileType, queue: TileType[]) {
  for (let i = 0; i < queue.length; i++) {
    if (isEqual(tile, queue[i])) return true;
  }
  return false;
}

export function checkStack(tile: TileType, stack: TileType[]) {
  for (let i = 0; i < stack.length; i++) {
    if (isEqual(stack[i], tile)) return true;
  }
  return false;
}

export const dropFromQueue = (tile: TileType, queue: TileType[]) => {
  for (let i = 0; i < queue.length; i++) {
    if (isEqual(tile, queue[i])) {
      queue.splice(i, 1);
      break;
    }
  }
};
