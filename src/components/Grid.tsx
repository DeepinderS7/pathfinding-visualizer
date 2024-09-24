import { usePathfinding } from "../hooks/usePathfinding";
import { twMerge } from "tailwind-merge";
import { MAX_COLS, MAX_ROWS } from "../utils/constants";
import { Tile } from "./Tiles";
import { MutableRefObject, useState } from "react";
import { createNewGrid } from "../utils/helper";

export function Grid({
  isVisualizationRunning,
}: {
  isVisualizationRunning: MutableRefObject<boolean>;
}) {
  const { grid, setGrid } = usePathfinding();
  const [isMouseDown, setIsMouseDown] = useState(false);

  const handleMouseDown = (
    row: number,
    col: number,
    isEnd: boolean,
    isStart: boolean
  ) => {
    // REFACTOR LATER ****
    if (isVisualizationRunning.current || isEnd || isStart) return;
    setIsMouseDown(true);
    const newGrid = createNewGrid(grid, row, col);
    setGrid(newGrid);
  };

  const handleMouseUp = (isEnd: boolean, isStart: boolean) => {
    if (isVisualizationRunning.current || isStart || isEnd) return;

    setIsMouseDown(false);
  };

  const handleMouseEnter = (
    row: number,
    col: number,
    isEnd: boolean,
    isStart: boolean
  ) => {
    if (isVisualizationRunning.current || isStart || isEnd) return;

    if (isMouseDown) {
      const newGrid = createNewGrid(grid, row, col);
      setGrid(newGrid);
    }
  };

  return (
    <div
      className={twMerge(
        "flex flex-col items-center justify-center border-sky-300 mt-10",
        `lg:min-h-{${MAX_ROWS * 17}px} md:min-h-{${
          MAX_ROWS * 15
        }px} xs: min-h-{${MAX_ROWS * 8}px} min-h-{${MAX_ROWS * 7}px} `,
        `lg:min-w-{${MAX_COLS * 17}px} md:min-w-{${
          MAX_COLS * 15
        }px} xs: min-w-{${MAX_COLS * 8}px} min-w-{${MAX_COLS * 7}px} `
      )}
    >
      {grid.map((r, rowIndex) => (
        <div key={rowIndex} className="flex">
          {r.map((tile, tileIndex) => {
            const { row, col, isEnd, isStart, isTraversed, isWall, isPath } =
              tile;
            return (
              <Tile
                key={tileIndex}
                row={row}
                col={col}
                isEnd={isEnd}
                isStart={isStart}
                isPath={isPath}
                isTraversed={isTraversed}
                isWall={isWall}
                handleMouseDown={() =>
                  handleMouseDown(row, col, isEnd, isStart)
                }
                handleMouseUp={() => handleMouseUp(isEnd, isStart)}
                handleMouseEnter={() =>
                  handleMouseEnter(row, col, isEnd, isStart)
                }
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
