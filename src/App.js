import "./assets/styles/App.css";
import { useEffect, useState } from "react";
import {
  ControlPanel,
  Footer,
  Header,
  GamePanel,
  GameOverModal,
} from "./components";
import { CellTypes, CellStates, GameState } from "./constants";
import {
  checkWinCondition,
  initializeCells,
  revealAllCells,
  revealBombs,
  revealPath,
  toggleCellState,
} from "./logic/gameData";
import Top10Modal from "./components/top-10-modal/top-10-modal.component";

// Game vars
let xGridSize = 9;
let yGridSize = 9;
let totalCellCount = xGridSize * yGridSize;
let totalBombs = 10;

function App() {
  const [gameState, setGameState] = useState(GameState.Pregame);
  const [cellData, setCellData] = useState([]);
  const [difficulty, setDifficulty] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isTopListVisible, setIsTopListVisible] = useState(false);
  const [scoresBasic, setScoresBasic] = useState([]);
  const [scoresMedium, setScoresMedium] = useState([]);
  const [scoresAdvanced, setScoresAdvanced] = useState([]);
  const [gameWon, setGameWon] = useState(false);
  const [toggledMineCount, setToggledMineCount] = useState(0);
  const [isFirstTurn, setIsFirstTurn] = useState(true);

  useEffect(() => {
    loadTop10();
  }, []);

  function init() {
    setGameState(GameState.Pregame);
    setCellData([]);
  }

  function onGameStart() {
    // Get initializing data
    if (difficulty === 1) {
      xGridSize = 9;
      yGridSize = 9;
      totalBombs = 10;
    } else if (difficulty === 2) {
      xGridSize = 16;
      yGridSize = 16;
      totalBombs = 40;
    } else if (difficulty === 3) {
      xGridSize = 30;
      yGridSize = 16;
      totalBombs = 99;
    }
    totalCellCount = xGridSize * yGridSize;

    // Prepare the game board
    let newCells = initializeCells(
      cellData,
      totalBombs,
      totalCellCount,
      xGridSize,
      yGridSize
    );

    setGameWon(false);
    setCellData(newCells);
    setGameState(GameState.Running);
    setToggledMineCount(0);
    setIsFirstTurn(true);
  }

  function onGameOver() {
    setGameState(GameState.GameOver);
    setCellData(revealAllCells(cellData));
  }

  function onDifficultyChange(newValue) {
    setDifficulty(parseInt(newValue));
  }

  function onGameOverModalClose() {
    init();
  }

  function onTimerChanged(newTime, timerId) {
    setTimeElapsed(newTime);
  }

  function onTopListClicked() {
    setIsTopListVisible(true);
  }

  function onScoreSubmit(name, time) {
    let newUser = { nickname: name, time: time };
    let newScores =
      difficulty === 1
        ? [...scoresBasic]
        : difficulty === 2
        ? [...scoresMedium]
        : [...scoresAdvanced];

    newScores.push(newUser);
    newScores.sort((a, b) => a.time - b.time);
    // Remover duplicados
    newScores = newScores.filter((score, index) => {
      return (
        index === newScores.findIndex((o) => score.nickname === o.nickname)
      );
    });
    if (newScores.length > 10) newScores.splice(10, 1);

    if (difficulty === 1) {
      setScoresBasic(newScores);
    } else if (difficulty === 2) {
      setScoresMedium(newScores);
    } else {
      setScoresAdvanced(newScores);
    }
    saveTop10(newScores);

    init();
  }

  function isHighscore(newScore) {
    let scores =
      difficulty === 1
        ? [...scoresBasic]
        : difficulty === 2
        ? [...scoresMedium]
        : [...scoresAdvanced];

    if (scores.length < 10) return true;
    for (let index = 0; index < scores.length; index++) {
      const score = scores[index];
      if (score.time > newScore) return true;
    }
    return false;
  }

  function saveTop10(newScores) {
    if (difficulty === 1) {
      localStorage.setItem("top10basic", JSON.stringify(newScores));
    } else if (difficulty === 2) {
      localStorage.setItem("top10med", JSON.stringify(newScores));
    } else {
      localStorage.setItem("top10adv", JSON.stringify(newScores));
    }
  }

  function loadTop10() {
    let readScoresBasic = localStorage.getItem("top10basic");
    if (readScoresBasic === null)
      localStorage.setItem("top10basic", JSON.stringify([]));
    else setScoresBasic(JSON.parse(readScoresBasic));

    let readScoresMedium = localStorage.getItem("top10med");
    if (readScoresMedium === null)
      localStorage.setItem("top10med", JSON.stringify([]));
    else setScoresMedium(JSON.parse(readScoresMedium));

    let readScoresAdvanced = localStorage.getItem("top10adv");
    if (readScoresAdvanced === null)
      localStorage.setItem("top10adv", JSON.stringify([]));
    else setScoresAdvanced(JSON.parse(readScoresAdvanced));
  }

  function cellPressedMain(cell) {
    // Não perder no primeiro turno
    if (
      isFirstTurn &&
      (cell.type === CellTypes.Bomb || cell.nearbyCount !== 0)
    ) {
      let newCells = [];
      do {
        newCells = initializeCells(
          newCells,
          totalBombs,
          totalCellCount,
          xGridSize,
          yGridSize
        );
      } while (
        newCells[cell.y * xGridSize + cell.x].type !== CellTypes.Empty ||
        newCells[cell.y * xGridSize + cell.x].nearbyCount !== 0
      );

      // Revelar
      cell = newCells[cell.y * xGridSize + cell.x];
      newCells = revealPath(newCells, cell, xGridSize, yGridSize);
      if (checkWinCondition(newCells)) {
        setGameWon(true);
        onGameOver();
      }
      setCellData(newCells);
      setToggledMineCount(getToggledMineCount(newCells));
    }

    // Clicar em bomba
    else if (cell.type === CellTypes.Bomb) {
      setGameWon(false);
      onGameOver();
    } // Clicar em celula vazia
    else {
      let newCells = revealPath(cellData, cell, xGridSize, yGridSize);
      setCellData(newCells);
      if (checkWinCondition(newCells)) {
        setGameWon(true);
        onGameOver();
      }
      setToggledMineCount(getToggledMineCount(newCells));
    }
    setIsFirstTurn(false);
  }

  function cellPressedSecondary(cell) {
    let newCell = toggleCellState(cell);
    let newCells = cellData.map((oldCell) => {
      if (oldCell.x === newCell.x && oldCell.y === newCell.y) return newCell;
      else return oldCell;
    });
    setCellData(newCells);
    if (newCell.state === CellStates.Flagged)
      setToggledMineCount(toggledMineCount + 1);
    else if (newCell.state === CellStates.Marked)
      setToggledMineCount(toggledMineCount - 1);
  }

  function getToggledMineCount(cells) {
    return cells.filter((cell) => cell.state === CellStates.Flagged).length;
  }

  return (
    <div id="container">
      <Header />
      <main className="main-content">
        <ControlPanel
          gameState={gameState}
          difficulty={difficulty}
          toggledMineCount={toggledMineCount}
          scoresBasic={scoresBasic}
          scoresMedium={scoresMedium}
          scoresAdvanced={scoresAdvanced}
          onGameStart={onGameStart}
          onGameOver={onGameOver}
          onDifficultyChanged={onDifficultyChange}
          onTimerChanged={onTimerChanged}
          onTopListClicked={onTopListClicked}
        />
        <GamePanel
          gameState={gameState}
          cellData={cellData}
          difficulty={difficulty}
          leftClickCallback={cellPressedMain}
          rightClickCallback={cellPressedSecondary}
          onGameStart={onGameStart}
          onGameOver={onGameOver}
        />
      </main>
      <GameOverModal
        gameState={gameState}
        time={timeElapsed}
        isHighscore={isHighscore}
        gameWon={gameWon}
        onGameOverModalClose={onGameOverModalClose}
        onScoreSubmit={onScoreSubmit}
      />
      <Top10Modal
        isOpen={isTopListVisible}
        scoresBasic={scoresBasic}
        scoresMedium={scoresMedium}
        scoresAdvanced={scoresAdvanced}
        handleClose={() => {
          setIsTopListVisible(false);
        }}
      />
      <Footer />
    </div>
  );
}

export default App;
