import position from "./position";

export default class agent {
  id: string;
  initialPosition: position;
  speed: number;

  constructor(
      id: string,
      initialPosition:position,
      speed: number
  ) {
    this.id = id;
    this.initialPosition=initialPosition;
    this.speed=speed;
  }
}
