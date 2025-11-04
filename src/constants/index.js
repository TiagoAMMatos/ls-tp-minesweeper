export const GameState = {
  Pregame: Symbol("pregame"),
  Running: Symbol("running"),
  GameOver: Symbol("gameover"),
};

export const CellTypes = {
  Empty: Symbol("empty"),
  Bomb: Symbol("bomb"),
};

export const CellStates = {
  Shown: Symbol("shown"),
  Hidden: Symbol("hidden"),
  Marked: Symbol("marked"),
  Flagged: Symbol("flagged"),
};
