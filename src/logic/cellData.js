export default class CellData {
    constructor(type, state, nearbyCount, y, x) {
      this.type = type;
      this.state = state;
      this.nearbyCount = nearbyCount;
      this.y = y;
      this.x = x;
    }
  }