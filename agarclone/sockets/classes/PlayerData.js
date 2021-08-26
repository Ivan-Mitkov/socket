// Data EVERYONE needs to know
// let settings = {
//   defaultOrbs: 500,
//   defaultSpeed: 3,
//   defaultRadius: 6,
//   //as the player get bigger the zoom needs to go out
//   defaultZoom: 1.5,
//   worldWidth: 500,
//   worldHeight: 500,
// };
export class PlayerData {
  constructor(playerName = "", settings) {
    this.name = playerName;
    this.locX = Math.floor(settings.worldWidth * Math.random() + 10);
    this.locY = Math.floor(settings.worldHeight * Math.random() + 10);
    this.radius = settings.defaultRadius;
    this.color = this.getRandomColor();
    this.score = 0;
  }

  getRandomColor() {
    const r = Math.floor(Math.random() * 200 + 50);
    const g = Math.floor(Math.random() * 200 + 50);
    const b = Math.floor(Math.random() * 200 + 50);
    return `rgb(${r},${g},${b})`;
  }
}
