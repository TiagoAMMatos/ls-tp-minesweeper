import { React, useState } from "react";
import "./control-panel.css";
import { GameState } from "../../constants";
import Timer from "../timer/timer.component";

export default function ControlPanel({
  gameState,
  difficulty,
  toggledMineCount,
  onGameStart,
  onGameOver,
  scoresBasic,
  scoresMedium,
  scoresAdvanced,
  onDifficultyChanged,
  onTimerChanged,
  onTopListClicked,
}) {
  let statsShownClass = gameState !== GameState.Pregame ? " gameStarted" : "";

  const handleTimer = (t, id) => {
    onTimerChanged(t, id);
  };

  function bestTime() {
    let scores =
      difficulty === 1
        ? scoresBasic
        : difficulty === 2
        ? scoresMedium
        : scoresAdvanced;

    if (scores.length > 0) {
      return scores[0].time.toString() + "s";
    } else {
      return "9999s";
    }
  }

  let nMaxMines = difficulty === 1 ? 10 : difficulty === 2 ? 40 : 90;

  return (
    <section id="panel-control">
      <h3 className="sr-only">Escolha do Nível</h3>
      <form className="form">
        <fieldset className="form-group">
          <label htmlFor="btLevel">Nível:</label>
          <select
            disabled={gameState !== GameState.Pregame}
            defaultValue={difficulty}
            id="btLevel"
            onChange={(e) => {
              onDifficultyChanged(e.target.value);
            }}
          >
            <option value="0">Seleccione...</option>
            <option value="1">Básico (9x9) - 10 minas</option>
            <option value="2">Intermédio (16x16) - 40 minas</option>
            <option value="3">Avançado (30x16) - 99 minas</option>
          </select>
        </fieldset>
        <button
          type="button"
          id="btPlay"
          onClick={() => {
            if (gameState === GameState.Pregame) onGameStart();
            else onGameOver();
          }}
          disabled={difficulty === 0}
        >
          {gameState === GameState.Running ? "Terminar Jogo" : "Iniciar Jogo"}
        </button>
      </form>
      <div className="form-metadata">
        <p id="message" role="alert" className="hide">
          Clique em Iniciar o Jogo!
        </p>
        <dl className={"list-item left" + statsShownClass}>
          <dt>Tempo de Jogo:</dt>
          <dd id="gameTime">
            {gameState === GameState.Running && <Timer onTimer={handleTimer} />}
            s
          </dd>
        </dl>
        <dl className={"list-item right" + statsShownClass}>
          <dt>Melhor Tempo:</dt>
          <dd id="pointsTop">{bestTime()}</dd>
        </dl>
        <dl className={"list-item left" + statsShownClass}>
          <dt>Minas:</dt>
          <dd id="points">{toggledMineCount + " / " + nMaxMines}</dd>
        </dl>
        <div id="top10" className="right">
          <button
            id="btTop"
            onClick={() => {
              onTopListClicked();
            }}
          >
            Ver TOP 10
          </button>
        </div>
      </div>
    </section>
  );
}
