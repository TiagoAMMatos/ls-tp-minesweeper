import React, { useState } from "react";
import { useRef, useEffect } from "react";
import "./top-10-modal.css";

function Top10Modal({
  isOpen,
  handleClose,
  scoresBasic,
  scoresMedium,
  scoresAdvanced,
}) {
  const [viewDifficulty, setViewDifficulty] = useState(1);
  const ref = useRef();

  useEffect(
    () => (isOpen ? ref.current?.showModal() : ref.current?.close()),
    [isOpen]
  );

  function fancyTime(seconds) {
    let date = new Date(seconds * 1000);
    let secondsString = date.getSeconds().toString().padStart(2, "0");

    return `${date.getMinutes()}:${secondsString}`;
  }

  let selectedScore =
    viewDifficulty === 1
      ? scoresBasic
      : viewDifficulty === 2
      ? scoresMedium
      : scoresAdvanced;

  return (
    <dialog id="modal-top10" ref={ref} onCancel={handleClose}>
      <div className="estilos">
        <header>
          <span
            className="closeModal"
            data-modalid="top10"
            onClick={handleClose}
          >
            &times;
          </span>
          <div>TOP 10</div>
          <div id="difficultyButtons">
            <button
              className={viewDifficulty === 1 ? "selected" : ""}
              onClick={() => {
                setViewDifficulty(1);
              }}
            >
              Básico
            </button>
            <button
              className={viewDifficulty === 2 ? "selected" : ""}
              onClick={() => {
                setViewDifficulty(2);
              }}
            >
              Intermédio
            </button>
            <button
              className={viewDifficulty === 3 ? "selected" : ""}
              onClick={() => {
                setViewDifficulty(3);
              }}
            >
              Avançado
            </button>
          </div>
        </header>
        <div className="info" id="infoTop">
          <div>
            <p>Nick Name</p>
            <p>Tempo</p>
          </div>
          {selectedScore.map((score) => {
            return (
              <div key={score.nickname}>
                <p>{score.nickname}</p>
                <p>{fancyTime(score.time)}</p>
              </div>
            );
          })}
        </div>
        <footer>
          <p>© Linguagens Script @ DEIS - ISEC</p>
        </footer>
      </div>
    </dialog>
  );
}

export default Top10Modal;
