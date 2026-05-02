import { Pin } from './Pin';

export abstract class Gate {
  public id: string;
  public inputs: Pin[];
  public outputs: Pin[];

  public x: number;
  public y: number;
  public width: number;
  public height: number;

  constructor(id: string) {
    this.id = id;
    this.inputs = [];
    this.outputs = [];
    this.x = 0;
    this.y = 0;
    this.width = 100;
    this.height = 60; 
  }

  abstract evaluate(): void;

  public updatePinPositions(): void {
    const inputSpacing = this.height / (this.inputs.length + 1);
    for (let i = 0; i < this.inputs.length; i++) {
      this.inputs[i].x = this.x;
      this.inputs[i].y = this.y + (inputSpacing * (i + 1));
    }

    const outputSpacing = this.height / (this.outputs.length + 1);
    for (let i = 0; i < this.outputs.length; i++) {
      this.outputs[i].x = this.x + this.width;
      this.outputs[i].y = this.y + (outputSpacing * (i + 1));
    }
  }
}