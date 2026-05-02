export type PinType = 'INPUT' | 'OUTPUT';

export class Pin {
  public id: string;
  public type: PinType;
  public value: boolean | null; 
  
  public x: number;
  public y: number;

  constructor(id: string, type: PinType) {
    this.id = id;
    this.type = type;
    this.value = null;
    this.x = 0;
    this.y = 0;
  }
}