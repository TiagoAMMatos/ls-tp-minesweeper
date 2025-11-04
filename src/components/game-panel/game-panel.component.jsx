import React from "react";
import "./game-panel.css";
import { useState } from "react";
import { CellStates, CellTypes } from "../../constants";
import { Cell } from "../index";

export default function GamePanel({
  gameState,
  cellData,
  difficulty,
  leftClickCallback,
  rightClickCallback,
}) {
  return (
    <div
      id="game"
      className={
        difficulty === 2 ? "intermedio" : difficulty === 3 ? "avancado" : ""
      }
      onContextMenu={(e) => {
        e.preventDefault();
      }}
    >
      {cellData.map((cell) => {
        return (
          <Cell
            key={`x${cell.x}-y${cell.y}`}
            gameState={gameState}
            cellData={cell}
            onLMBClick={leftClickCallback}
            onRMBClick={rightClickCallback}
          />
        );
      })}
    </div>
  );
}
