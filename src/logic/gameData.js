import { GameState, CellStates, CellTypes } from "../constants";
import { default as CellData } from "./cellData";

function getNearbyCells(cells, x, y, xGridSize, yGridSize) {
  let nearbyCells = [];
  // Up Down Left Right
  if (y > 0) {
    nearbyCells.push(cells[(y - 1) * xGridSize + x]);
  }
  if (y < yGridSize - 1) {
    nearbyCells.push(cells[(y + 1) * xGridSize + x]);
  }
  if (x > 0) {
    nearbyCells.push(cells[y * xGridSize + x - 1]);
  }
  if (x < xGridSize - 1) {
    nearbyCells.push(cells[y * xGridSize + x + 1]);
  }
  // TL TR BL BR
  if (y > 0 && x > 0) {
    nearbyCells.push(cells[(y - 1) * xGridSize + x - 1]);
  }
  if (y > 0 && x < xGridSize - 1) {
    nearbyCells.push(cells[(y - 1) * xGridSize + x + 1]);
  }
  if (y < yGridSize - 1 && x > 0) {
    nearbyCells.push(cells[(y + 1) * xGridSize + x - 1]);
  }
  if (y < yGridSize - 1 && x < xGridSize - 1) {
    nearbyCells.push(cells[(y + 1) * xGridSize + x + 1]);
  }
  return nearbyCells;
}

function getNearbyCells_v2(cells, x, y, xGridSize, yGridSize) {
  let nearbyCells = [];
  // Up Down Left Right
  if (y > 0) {
    nearbyCells.push(cells[(y - 1) * xGridSize + x]);
  }
  if (y < yGridSize - 1) {
    nearbyCells.push(cells[(y + 1) * xGridSize + x]);
  }
  if (x > 0) {
    nearbyCells.push(cells[y * xGridSize + x - 1]);
  }
  if (x < xGridSize - 1) {
    nearbyCells.push(cells[y * xGridSize + x + 1]);
  }
  return nearbyCells;
}

export function initializeCells(
  cells,
  totalBombs,
  totalCellCount,
  xGridSize,
  yGridSize
) {
  cells = [];

  // Create Bomb cells
  for (let i = 0; i < totalBombs; i++) {
    cells.push(new CellData(CellTypes.Bomb, CellStates.Hidden, 0));
  }

  // Create empty Cells
  for (let i = 0; i < totalCellCount - totalBombs; i++) {
    cells.push(new CellData(CellTypes.Empty, CellStates.Hidden, 0));
  }
  shuffleArray(cells);

  // Create Numbers
  for (let y = 0; y < yGridSize; y++) {
    for (let x = 0; x < xGridSize; x++) {
      let curCell = cells[y * xGridSize + x];
      curCell.x = x;
      curCell.y = y;
      if (curCell.type === CellTypes.Bomb) {
        let nearbyCells = getNearbyCells(cells, x, y, xGridSize, yGridSize);
        nearbyCells.forEach((element) => {
          element.nearbyCount += 1;
        });
      }
    }
  }

  return cells;
}

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
};

export function revealPath(cells, startCell, xGridSize, yGridSize) {
  var newCells = [...cells];
  let cellsToExplore = [startCell];
  let currentUncoveredCells = 0;

  while (cellsToExplore.length > 0) {
    let nextCell = cellsToExplore.shift();
    nextCell.state = CellStates.Shown;
    currentUncoveredCells += 1;

    if (nextCell.nearbyCount === 0) {
      let neighbors = getNearbyCells(
        newCells,
        nextCell.x,
        nextCell.y,
        xGridSize,
        yGridSize
      );
      neighbors = neighbors.filter((c) => c.state !== CellStates.Shown);
      cellsToExplore.push(...neighbors);
    }
    // Remover duplicados
    cellsToExplore = cellsToExplore.filter(
      (item, index) => cellsToExplore.indexOf(item) === index
    );
  }

  return newCells;
}

export function revealBombs(cells) {
  return cells.map((cell) => {
    if (cell.type === CellTypes.Bomb) cell.state = CellStates.Shown;
    return cell;
  });
}

export function revealAllCells(cells) {
  return cells.map((cell) => {
    cell.state = CellStates.Shown;
    return cell;
  });
}

export function toggleCellState(cell) {
  let newCell = cell;
  newCell.state =
    cell.state === CellStates.Hidden
      ? CellStates.Flagged
      : cell.state === CellStates.Flagged
      ? CellStates.Marked
      : CellStates.Hidden;
  return cell;
}

export function checkWinCondition(cells) {
  for (let index = 0; index < cells.length; index++) {
    const cell = cells[index];
    if (cell.type === CellTypes.Empty && cell.state !== CellStates.Shown) {
      return false;
    }
  }
  return true;
}
