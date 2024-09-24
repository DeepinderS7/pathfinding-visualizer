import { MutableRefObject, useState } from "react";
import { usePathfinding } from "../hooks/usePathfinding";
import {
  EXTENDED_SLEEP_TIME,
  MAZES,
  PATHFINDING_ALGORITHMS,
  SLEEP_TIME,
  SPEEDS,
} from "../utils/constants";
import { resetGrid } from "../utils/helper";
import { AlgorithmType, MazeType, SpeedType } from "../utils/types";
import Select from "./Select";
import { runmazeAlgo } from "../utils/runMazeAlgo";
import { useTile } from "../hooks/useTile";
import { useSpeed } from "../hooks/useSpeed";
import { PlayButton } from "./PlayButton";
import { runPathfindingAlgo } from "../utils/runPathfindingAlgo";
import { animatePath } from "../utils/animatePath";

export default function Nav({
  isVisualizationRunning,
}: {
  isVisualizationRunning: MutableRefObject<boolean>;
}) {
  const [isDisabled, setIsDisabled] = useState(false);
  const {
    maze,
    setMaze,
    grid,
    setGrid,
    isGraphVisualized,
    setIsGraphVisualized,
    algorithm,
    setAlgoritm,
  } = usePathfinding();
  const { startTile, endTile } = useTile();
  const { speed, setSpeed } = useSpeed();

  // refactor later ****
  const handleGenerateMaze = (maze: MazeType) => {
    resetGrid({ grid });
    setMaze(maze);
    if (maze === "NONE") return;

    setIsDisabled(true);
    runmazeAlgo({
      maze,
      grid,
      startTile,
      endTile,
      setIsDisabled,
      speed,
    });

    const newGrid = grid.slice();
    setGrid(newGrid);
    setIsGraphVisualized(false);
  };

  const handleRunVisualizer = () => {
    if (isGraphVisualized) {
      setIsGraphVisualized(false);
      resetGrid({ grid: grid.slice() });
      setMaze("NONE");
      return;
    }

    const { traversedTiles, path } = runPathfindingAlgo({
      algorithm,
      grid,
      startTile,
      endTile,
    });

    animatePath(traversedTiles, path, startTile, endTile, speed);
    setIsDisabled(true);
    isVisualizationRunning.current = true;

    setTimeout(() => {
      const newGrid = grid.slice();
      setGrid(newGrid);
      setIsGraphVisualized(true);
      setIsDisabled(false);
      isVisualizationRunning.current = false;
    }, 10 * (traversedTiles.length + SLEEP_TIME * 2) + EXTENDED_SLEEP_TIME * (path.length + 60) * +`${SPEEDS.find((s) => s.value === speed)!.value === 2 ? 3 : SPEEDS.find((s) => s.value === speed)!.value}`);
  };

  return (
    <div className="flex justify-center items-center min-h-[4.5rem] border-b shadow-gray-600 sm:px-5  px-0">
      <nav className="flex items-center lg:justify-between justify-center w-full sm:w-[52rem] sm:py-1">
        <h1 className="lg:flex hidden w-[40%] text-2xl pl-1">
          Pathfinding Visualizer
        </h1>
        <div className="flex sm:items-end items-center justify-start sm:justify-between sm:flex-row flex-col sm:space-y-0 space-y-3 sm:py-0 py-4 sm:space-x-4">
          <Select
            label="Maze"
            value={maze}
            options={MAZES}
            onChange={(e) => {
              handleGenerateMaze(e.target.value as MazeType);
            }}
            isDisabled={isDisabled || isGraphVisualized}
          />
          <Select
            label="Graph"
            value={algorithm}
            options={PATHFINDING_ALGORITHMS}
            onChange={(e) => {
              setAlgoritm(e.target.value as AlgorithmType);
            }}
            isDisabled={isDisabled || isGraphVisualized}
          />
          <Select
            label="Speed"
            value={speed}
            options={SPEEDS}
            onChange={(e) => {
              setSpeed(+e.target.value as SpeedType);
            }}
            isDisabled={isDisabled || isGraphVisualized}
          />
          <PlayButton
            isDisabled={isDisabled}
            isGraphVisualized={isGraphVisualized}
            handleRunVisualizer={handleRunVisualizer}
          />
        </div>
      </nav>
    </div>
  );
}
