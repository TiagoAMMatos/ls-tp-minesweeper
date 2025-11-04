import React, { useState } from "react";
import { useRef, useEffect } from "react";
import "./game-over-modal.css";
import { GameState } from "../../constants";

function GameOverModal({
  gameState,
  time,
  onGameOverModalClose,
  onScoreSubmit,
  isHighscore,
  gameWon,
}) {
  const [nickname, setNickname] = useState("");
  const ref = useRef();

  useEffect(() => {
    if (gameState === GameState.GameOver) {
      ref.current?.showModal();
      setNickname("");
    } else {
      ref.current?.close();
    }
  }, [gameState]);

  return (
    <dialog id="modal-gameOver" ref={ref} onCancel={onGameOverModalClose}>
      <div className="estilos">
        <header>
          <span
            className="closeModal"
            data-modalid="gameOver"
            onClick={onGameOverModalClose}
          >
            &times;
          </span>
          <div>Jogo Terminado</div>
        </header>
        <div className="info" id="messageGameOver">
          {!gameWon && <p>Jogo perdido!</p>}
          {gameWon && <p>Tempo: {time}</p>}
        </div>
        {gameWon && isHighscore(time) && (
          <div className="info" id="nickname">
            Nick Name:
            <input
              onChange={(e) => {
                setNickname(e.target.value);
              }}
              type="text"
              id="inputNick"
              size="16"
              placeholder="Introduza seu Nick"
              value={nickname}
            />
            <button
              id="okTop"
              onClick={() => {
                onScoreSubmit(nickname, time);
              }}
            >
              ok
            </button>
          </div>
        )}
        <footer>
          <p>
            <em>© Linguagens Script @ DEIS - ISEC</em>
          </p>
        </footer>
      </div>
    </dialog>
  );
}

export default GameOverModal;
