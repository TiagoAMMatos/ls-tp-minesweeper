import React from "react";
import "./cell.css";
import { CellStates, CellTypes, GameState } from "../../constants";
import { memo } from "react";

export default function Cell({ gameState, cellData, onLMBClick, onRMBClick }) {
  let type = cellData.type;
  let state = cellData.state;
  let nearbyCount = cellData.nearbyCount;

  let content = " ";
  let colorClass = "";
  let cellState = "";

  // Display
  switch (state) {
    case CellStates.Hidden:
      content = " ";
      cellState = "cell-hidden";
      break;
    case CellStates.Flagged:
      content = "🚩";
      cellState = "cell-hidden";
      break;
    case CellStates.Marked:
      content = "❔";
      cellState = "cell-hidden";
      break;
    case CellStates.Shown:
      content = "";
      cellState = "";

      if (type === CellTypes.Bomb) {
        content = "💣";
        colorClass = "cell-bomb";
      } else if (nearbyCount !== 0) {
        content = String(nearbyCount);
        colorClass = `cell-number${nearbyCount}`;
      }
      break;
  }

  return (
    <div
      className={[colorClass, cellState].join(" ")}
      onClick={() => {
        if (gameState !== GameState.Running) return;
        if (state === CellStates.Shown) return;
        onLMBClick(cellData);
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        if (state === CellStates.Shown) return;
        onRMBClick(cellData);
      }}
    >
      <p>{content}</p>
    </div>
  );
}
