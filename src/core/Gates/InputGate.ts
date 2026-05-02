import { Gate } from '../Gate';
import { Pin } from '../Pin';

export class InputGate extends Gate {
  public state: boolean;

  constructor(id: string) {
    super(id);
    this.width = 40; 
    this.height = 40;
    this.state = false; 
    this.outputs.push(new Pin(`${id}-out`, 'OUTPUT'));
  }

  evaluate(): void {
    this.outputs[0].value = this.state;
  }
}