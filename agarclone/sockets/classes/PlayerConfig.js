//Data no other player needs to know about
export class PlayerConfig {
  constructor(settings) {
    //mouse doesn't moved yet
    this.xVector = 0;
    this.yVector = 0;
    this.speed = settings.defaultSpeed || 10;
    this.zoom = settings.defaultZoom || 1.5;
  }
}
