import { Pin } from './Pin';

export class Wire {
  public id: string;
  public from: Pin;
  public to: Pin;
  
  public points: {x: number, y: number}[];

  constructor(id: string, from: Pin, to: Pin) {
    this.id = id;
    this.from = from;
    this.to = to;
    this.points = [];
  }

  public update(): void {
    if (this.from.value !== null && this.from.value !== undefined) {
       this.to.value = this.from.value;
    } else {
       this.to.value = null;
    }
  }
}