import { Gate } from '../Gate';
import { Pin } from '../Pin';

export class OutputGate extends Gate {
  constructor(id: string) {
    super(id);
    this.width = 40;
    this.height = 40;    
    this.inputs.push(new Pin(`${id}-in1`, 'INPUT'));
  }

  evaluate(): void {}
}